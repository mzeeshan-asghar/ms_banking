"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  encryptId,
  extractCustomerIdFromUrl,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { plaidClient } from "@/lib/plaid";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { revalidatePath } from "next/cache";
import {
  addFundingSource,
  createDwollaCustomer,
} from "@/lib/actions/dwolla.actions";
import { plaidConfig } from "../plaid/config";

// Appwrite Actions
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const setSessionCookies = async (secret: string) => {
  const { key, maxAge } = appwriteConfig.sessionConfig;
  (await cookies()).set(key, secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  });
};

export const SignUpUser = async ({ password, ...formData }: SignUpProps) => {
  const { email, firstName, lastName } = formData;
  let existingUser = null;

  try {
    existingUser = await getUserByEmail(email);
    if (existingUser) return;

    const { account, databases } = await createAdminClient();

    const newUser = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    if (!newUser) throw new Error("Failed to create user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...formData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Failed to create Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const session = await account.createEmailPasswordSession(email, password);
    await setSessionCookies(session.secret);

    const userData = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        ...formData,
        accountId: session.userId,
        dwollaCustomerUrl,
        dwollaCustomerId,
      },
    );

    return parseStringify(userData);
  } catch (error) {
    handleError(error, "Failed to create account");
  } finally {
    if (existingUser) {
      console.log("Redirecting to sign-in as user already exists.");
      redirect("/sign-in");
    }
  }
};

export const signInUser = async ({ email, password }: logInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);
    await setSessionCookies(session.secret);

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession("current");
    (await cookies()).delete(appwriteConfig.sessionConfig.key);
  } catch (error) {
    handleError(error, "Failed to sign out");
  } finally {
    redirect("/sign-in");
  }
};

export const createBankAccount = async (userData: createBankAccountProps) => {
  try {
    const { databases } = await createAdminClient();

    const bankAccount = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      ID.unique(),
      userData,
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

// Plaid Actions
export const createLinkToken = async (user: UserProps) => {
  try {
    const tokenProps = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: plaidConfig.products as Products[],
      language: "en",
      country_codes: plaidConfig.countryCodes as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenProps);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.error("Error creating Plaid Link Token:", error);
    throw new Error(
      "Failed to create Plaid Link Token. Check the logs for details.",
    );
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: {
  publicToken: string;
  user: UserProps;
}) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getSingleBank = async ({ documentId }: { documentId: string }) => {
  try {
    const { databases } = await createAdminClient();

    const bank = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      [Query.equal("$id", [documentId])],
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getMultipleBanks = async ({ userId }: { userId: string }) => {
  try {
    const { databases } = await createAdminClient();

    const banks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      [Query.equal("userId", [userId])],
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({
  accountId,
}: {
  accountId: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const bank = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      [Query.equal("accountId", [accountId])],
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

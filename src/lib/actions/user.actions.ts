"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { handleError, parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export const SignUpUser = async ({ password, ...userData }: SignUpProps) => {
  const { email, firstName, lastName } = userData;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const { account, databases } = await createAdminClient();

    await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    const session = await account.createEmailPasswordSession(email, password);
    await setSessionCookies(session.secret);

    const accountData = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        ...userData,
        accountId: session.$id,
      },
    );

    return parseStringify({ accountId: accountData.$id });
  } catch (error) {
    handleError(error, "Failed to create account");
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

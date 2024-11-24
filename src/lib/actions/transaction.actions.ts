"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";

export const createTransaction = async (
  transaction: CreateTransactionProps,
) => {
  try {
    const { databases } = await createAdminClient();

    const newTransaction = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      ID.unique(),
      {
        channel: "online",
        category: "Transfer",
        ...transaction,
      },
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: {
  bankId: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const senderTransactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      [Query.equal("senderBankId", bankId)],
    );

    const receiverTransactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      [Query.equal("receiverBankId", bankId)],
    );

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...receiverTransactions.documents,
      ],
    };

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
};

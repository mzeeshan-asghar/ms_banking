export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION!,
  itemCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ITEM_COLLECTION!,
  bankCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION!,
  transactionCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
  sessionConfig: { key: "appwrite-session", maxAge: 7 * 24 * 60 * 60 },
};

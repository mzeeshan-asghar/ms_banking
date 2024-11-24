export const plaidConfig = {
  clientId: process.env.NEXT_PUBLIC_PLAID_CLIENT_ID!,
  products: process.env.NEXT_PUBLIC_PLAID_PRODUCTS!.split(","),
  countryCodes: process.env.NEXT_PUBLIC_PLAID_COUNTRY_CODES!.split(","),
  env: process.env.NEXT_PUBLIC_PLAID_ENV!,
  secretKey: process.env.NEXT_PLAID_SECRET!,
};

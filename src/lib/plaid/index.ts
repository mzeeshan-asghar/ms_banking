import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { plaidConfig } from "@/lib/plaid/config";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": plaidConfig.clientId,
      "PLAID-SECRET": plaidConfig.secretKey,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

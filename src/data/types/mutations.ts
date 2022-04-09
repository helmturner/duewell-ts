import { ItemPublicTokenExchangeResponse } from "plaid";
import type { MutationFunction, MutationMeta } from "react-query";

type PlaidPublicTokenExchangeResult = {
    "_id": string;
    "user_id": string;
    "plaid_institution_id": string;
    "status": string;
    "created_at": string;
    "updated_at": string;
}

interface PlaidPublicTokenExchangeParams extends MutationMeta {
  public_token: string;
  institution_id: string;
}

export type PlaidPublicTokenExchange = MutationFunction<
  ItemPublicTokenExchangeResponse,
  PlaidPublicTokenExchangeParams
>;

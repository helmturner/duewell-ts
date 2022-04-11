import type { Filter, OptionalId, WithoutId } from "mongodb";
import type { UserData } from "auth0";
import type {
  AccountBase,
  Item,
  ItemPublicTokenExchangeResponse,
  Transaction as PlaidTransaction,
} from "plaid";
import type { Receipt as AzureReceipt } from "@azure/ai-form-recognizer";

export type TransactionModel = OptionalId<PlaidTransaction>;
export type ReceiptModel = OptionalId<AzureReceipt["fields"]>;
export type PlaidItemModel = OptionalId<Partial<Pick<Item, "institution_id">>> &
  Partial<ItemPublicTokenExchangeResponse> &
  Partial<Pick<UserData, "user_id">> &
  Partial<{ status: "good" | "bad" }>;
export type UserModel = OptionalId<UserData>;
export type PlaidApiEventModel = OptionalId<{
  item_id?: string;
  user_id?: string;
  plaid_method: string;
  arguments: string[];
  request_id: string;
  error_type: string;
  error_code: string;
}>;
export type AccountModel = OptionalId<AccountBase>;

export type PlaidItemFilter = Filter<PlaidItemModel>;
export type UserFilter = Filter<UserModel>;
export type ReceiptFilter = Filter<ReceiptModel>;
export type TransactionFilter = Filter<TransactionModel>;
export type PlaidApiEventFilter = Filter<PlaidApiEventModel>;
export type AccountFilter = Filter<AccountModel>;

export type PlaidItem = WithoutId<PlaidItemModel>;
export type PlaidApiEvent = WithoutId<PlaidApiEventModel>;
export type Account = WithoutId<AccountModel>;
export type Transaction = WithoutId<TransactionModel>;
export type User = WithoutId<UserModel>;
export type Receipt = WithoutId<ReceiptModel>;

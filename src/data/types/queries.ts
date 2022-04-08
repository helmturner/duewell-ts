import type { LinkTokenCreateResponse, Transaction, Item } from "plaid";
import type {
  EnsuredQueryKey,
  QueryFunction,
  QueryFunctionContext,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

/*
LINK TOKENS
*/
export type LinkTokenQuery = UseQueryResult<LinkTokenCreateResponse, any>;

export type LinkTokenQueryKey = EnsuredQueryKey<
  ["link-tokens", { item_id: string | null | undefined }]
>;

export type LinkTokenQueryFunction = QueryFunction<
  LinkTokenCreateResponse,
  LinkTokenQueryKey
>;

export type LinkTokenQueryOptions = Omit<
  UseQueryOptions<
    LinkTokenCreateResponse,
    any,
    LinkTokenCreateResponse,
    LinkTokenQueryKey
  >,
  "queryKey" | "queryFn"
>;


/*
TRANSACTIONS
*/
export type TransactionFilter = {
  transactionId?: string;
  accountId?: string;
  itemId?: string;
};

export type TransactionQuery = UseQueryResult<Transaction[], any>;

export type TransactionQueryKey = EnsuredQueryKey<
  ["transactions", Partial<TransactionFilter>]
>;

export type TransactionQueryOptions = Omit<
  UseQueryOptions<Transaction[], any, Transaction[], TransactionQueryKey>,
  "queryKey" | "queryFn"
>;

export type TransactionQueryFunction = QueryFunction<
  Transaction[],
  TransactionQueryKey
>;

/*
ITEMS
*/
export type ItemFilter = {
  needsUpdate: boolean;
};

export type ItemQueryKey = EnsuredQueryKey<["items", Partial<ItemFilter>]>;

export type ItemQueryOptions = Omit<
  UseQueryOptions<Item[], any, Item[], ItemQueryKey>,
  "queryKey" | "queryFn"
>;

export type ItemQueryFunction = QueryFunction<Item[], ItemQueryKey>;

import type { LinkTokenCreateResponse, Transaction } from "plaid";
import type {
  EnsuredQueryKey,
  QueryFunction,
  UseQueryOptions,
} from "react-query";

export type LinkTokenQueryKey = EnsuredQueryKey<
  [string, { user_id: string; item_id: string | null | undefined }]
>;

export type LinkTokenQueryFunction = QueryFunction<
  LinkTokenCreateResponse,
  LinkTokenQueryKey
>;

export type LinkTokenQueryOptions = Omit<
  UseQueryOptions<
    LinkTokenCreateResponse,
    unknown,
    LinkTokenCreateResponse,
    LinkTokenQueryKey
  >,
  "queryKey" | "queryFn"
>;

export type TransactionFilter = {
  transactionId?: string;
  accountId?: string;
  itemId?: string;
};

export type TransactionQueryKey = EnsuredQueryKey<
  [string, { user_id: string } & Partial<TransactionFilter>]
>;

export type TransactionQueryOptions = Omit<
  UseQueryOptions<Transaction[], unknown, Transaction[], TransactionQueryKey>,
  "queryKey" | "queryFn"
>;

export type TransactionQueryFunction = QueryFunction<
  Transaction[],
  TransactionQueryKey
>;

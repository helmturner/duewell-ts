import { useUser } from "@auth0/nextjs-auth0";
import { useQuery } from "react-query";

import type {
  TransactionFilter,
  TransactionQueryFunction,
  TransactionQueryKey,
  TransactionQueryOptions,
} from "data/types";

//TODO: Update queryFn to accept params from queryKey
export const getTransactions: TransactionQueryFunction = ({ queryKey }) => {
  const { user_id, ...filters } = queryKey[1];

  return fetch(`/api/plaid/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    return res.json();
  });
};

export const useTransactions = (
  filter?: TransactionFilter,
  options?: TransactionQueryOptions
) => {
  const { user } = useUser();
  const config = { staleTime: 5 * 60 * 1000, ...options };
  const queryKey: TransactionQueryKey = [
    "transactions",
    {
      user_id: user!.sub!,
      ...filter,
    },
  ];

  return useQuery({
    queryFn: getTransactions,
    queryKey,
    ...config,
  });
};

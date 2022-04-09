import { useQuery, useQueryClient } from "react-query";
import type { TransactionQueryOptions, TransactionFilter, TransactionQueryFunction } from "data/types";

export const getTransactions: TransactionQueryFunction = ({queryKey}) => {
  const params = queryKey[1]

  return fetch(`/api/plaid/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    return res.json();
  });
};

export const useTransactions = ({
  filter = {},
  options = {},
}: {
  filter?: Partial<TransactionFilter>;
  options?: TransactionQueryOptions;
}) => {
  const config = { staleTime: 5 * 60 * 1000, ...options };
  return useQuery({
    queryKey: ["transactions", filter],
    queryFn: getTransactions,
    ...config,
  });
};

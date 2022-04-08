import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useQuery } from "react-query";
import { useItems } from "data/hooks";

import type { PlaidLinkError } from "react-plaid-link";
import type {
  LinkTokenQuery,
  LinkTokenQueryOptions,
  LinkTokenQueryFunction,
} from "data/types";
/**
 * _Wrapper for the_ `usePlaidLink` _hook that manages Link state internally_
 * @param options Optional query configuration object
 * @returns an object with convenient methods for launching Plaid Link
 */
export const useLink = (options: LinkTokenQueryOptions = {}) => {
  const [item_id, setItem_id] = useState<string | null>();
  const [linkError, setLinkError] = useState<PlaidLinkError>();
  const items = useItems();

  const query: LinkTokenQuery = useQuery({
    queryKey: ["link-tokens", { item_id: undefined }],
    queryFn: getPlaidLinkToken,
    ...options,
    staleTime: item_id ? time(30, "minutes") : time(4, "hours"),
    enabled: typeof item_id !== "undefined",
  });

  const { open, ready } = usePlaidLink({
    token: query.data?.link_token ?? null,
    onSuccess: (public_token, metadata) => {
      if (item_id) {
        // TODO: update mode
        console.warn("UPDATE MODE NOT YET IMPLEMENTED");
      } else {
        items.create(public_token, metadata);
      }
      query.remove();
      setItem_id(undefined);
    },
    onEvent: (eventName, metadata) => {
      console.info(`${eventName} EVENT`, metadata);
    },
    onExit: (error, metadata) => {
      console.info("EXIT", metadata);
      error && setLinkError(error);
      setItem_id(undefined);
    },
  });

  // output errors to console if they occur
  useEffect(() => {
    query.error && console.error(query.error);
    linkError && console.error(linkError);
  }, [linkError, query.error]);

  // open Link when `item_id` is not undefined (after fetching completes and Link is ready)
  useEffect(() => {
    typeof item_id !== "undefined" && !query.isFetching && ready && open();
  }, [ready, open, query.isFetching, item_id]);

  return {
    createItemLink: () => setItem_id(null),
    updateItemLink: (item_id: string) => setItem_id(item_id),
  };
};
/**
 * _Retrieves a link-token from_ __Plaid__
 * @param queryContext The context provided by react-query
 * @returns an object containing the link-token and request id
 */
const getPlaidLinkToken: LinkTokenQueryFunction = async function (
  queryContext
) {
  const params = queryContext.queryKey[1];

  const response = await fetch("/api/plaid/link", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * @param unit `hours` | `minutes` (defaults to 'minutes')
 * @param count number to multiply by `unit`
 * @returns `number` the specified unit (in milliseconds) multiplied by `count`
 * */
function time(count: number, unit: "hours" | `minutes`): number {
  if (unit === "hours") return count * 3600000;
  return count * 60000;
}

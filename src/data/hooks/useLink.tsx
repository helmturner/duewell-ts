import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useMutation, useQuery } from "react-query";

import type { PlaidLinkError } from "react-plaid-link";
import type {
  LinkTokenQuery,
  LinkTokenQueryOptions,
  LinkTokenQueryFunction,
} from "data/types";
import { PlaidPublicTokenExchange } from "data/types/mutations";
/**
 * _Wrapper for the_ `usePlaidLink` _hook that manages Link state internally_
 * @param options Optional query configuration object
 * @returns an object with convenient methods for launching Plaid Link
 */
export const useLink = (options: LinkTokenQueryOptions = {}) => {
  const [item_id, setItem_id] = useState<string | null>();
  const [linkError, setLinkError] = useState<PlaidLinkError>();

  const tokenInstance: LinkTokenQuery = useQuery({
    queryKey: ["link-tokens", { item_id: undefined }],
    queryFn: getPlaidLinkToken,
    ...options,
    staleTime: item_id ? time(30, "minutes") : time(4, "hours"),
    enabled: typeof item_id !== "undefined",
  });

  const { mutate: postPlaidLinkToken, data } = useMutation(exchangeToken)

  const { open, ready } = usePlaidLink({
    token: tokenInstance.data?.link_token ?? null,
    onSuccess: (public_token, metadata) => {
      if (item_id) {
        // TODO: update mode
        console.warn("UPDATE MODE NOT YET IMPLEMENTED");//XXX
      } else if (metadata.institution) {
        postPlaidLinkToken({public_token, institution_id: metadata.institution.institution_id});
        console.log("DATA FROM MUTATION", data)//XXX
      } else throw new Error("No institution received from Plaid Link flow")
      tokenInstance.remove();
      setItem_id(undefined);
    },
    onEvent: (eventName, metadata) => {
      console.info(`${eventName} EVENT`, metadata);//XXX
    },
    onExit: (error, metadata) => {
      console.info("EXIT", metadata);//XXX
      error && setLinkError(error);
      setItem_id(undefined);
    },
  });

  // output errors to console if they occur
  useEffect(() => {
    tokenInstance.error && console.error(tokenInstance.error);//XXX
    linkError && console.error(linkError);//XXX
  }, [linkError, tokenInstance.error]);

  // open Link when `item_id` is not undefined (after fetching completes and Link is ready)
  useEffect(() => {
    typeof item_id !== "undefined" && !tokenInstance.isFetching && ready && open();
  }, [ready, open, tokenInstance.isFetching, item_id]);

  return {
    createItemLink: () => setItem_id(null),
    updateItemLink: (item_id: string) => setItem_id(item_id),
  };
};

/**
 * _Initiates a public-token exchange_
 */
const exchangeToken: PlaidPublicTokenExchange = async ({
  public_token,
  institution_id,
}) => {
  const response = await fetch("api/plaid/items", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_token,
      institution_id,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);//XXX
  }

  return response.json();
};
/**
 * _Retrieves a link-token from_ __Plaid__
 * @param queryContext The context provided by react-query
 * @returns an object containing the link-token and request id
 */
const getPlaidLinkToken: LinkTokenQueryFunction = async (
  queryContext
) => {
  const params = queryContext.queryKey[1];

  const response = await fetch("api/plaid/link", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);//XXX
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

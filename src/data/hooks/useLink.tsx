import { useUser } from "@auth0/nextjs-auth0";
import { PlaidLinkError, usePlaidLink } from "react-plaid-link";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { getPlaidLinkToken } from 'data/queries'

import type { LinkTokenQueryOptions, LinkTokenQueryKey } from 'data/types'

/**
 * @description Wrapper for the `usePlaidLink` hook that manages Link state internally
 * @param item_id If supplied, launches Link in "update mode" for that item
 * @param options Optional query configuration object
 * @returns an object with convenient methods for launching Plaid Link
 */
export const useLink = (
  item_id?: string | null,
  options?: LinkTokenQueryOptions
) => {
  const [queryKey, setQueryKey] = useState<LinkTokenQueryKey>();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [userError, setUserError] =
    useState<ReturnType<typeof useUser>["error"]>();
  const [linkError, setLinkError] = useState<PlaidLinkError>();

  // call hooks from React-Query, Auth0, and PlaidLink, respectively
  const queryClient = useQueryClient();
  const userContext = useUser();
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      if (item_id) {
        // update mode
        console.warn("UPDATE MODE NOT YET IMPLEMENTED")
      } else {
        console.info("SUCCESS", metadata);
        queryClient.removeQueries(queryKey);  
      }
    },
    onEvent: (eventName, metadata) => {
      console.info(`${eventName} EVENT`, metadata);
    },
    onExit: (error, metadata) => {
      console.info("EXIT", metadata);
      setLinkToken(null);
      error && setLinkError(error);
    },
  });

  // update the queryKey when queryFn params change
  useEffect(() => {
    const { user } = userContext;
    user?.sub && setQueryKey(["link_token", { user_id: user.sub, item_id }]);
  }, [userContext, item_id]);

  // set error state if a user error occurs
  useEffect(() => {
    const { error } = userContext;
    error && setUserError(error);
  }, [userContext]);

  // output errors to console if they occur
  useEffect(() => {
    userError && console.error(userError);
    linkError && console.error(linkError);
  }, [userError, linkError]);

  // automatically launch link when `linkToken` is set and Link is ready
  useEffect(() => {
    linkToken && ready && open();
  }, [ready, open, linkToken]);

  return {
    launchLink: async () => {
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: getPlaidLinkToken,
        ...options,
        /*  https://plaid.com/docs/quickstart/glossary/#link-token
            Link tokens expire after 4 hours
            (or 30 minutes when used in "Update Mode") */
        staleTime: item_id ? 30 * 60 * 1000 : 4 * 60 * 60 * 1000,
      });
      setLinkToken(data?.link_token ?? null);
    },
  };
};
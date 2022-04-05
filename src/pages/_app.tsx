import Layout from "components/layout";
import { useState } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import Toastify from "react-toastify";

import type { AppProps } from "next/app"

//TODO: resolution for eslint-plugin-react is temp workaround for https://github.com/yannickcr/eslint-plugin-react/issues/3215

/* XXX const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {},
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
      refetchOnMount: process.env.NODE_ENV === "production",
      keepPreviousData: true,
    }
  },
  mutationCache: new MutationCache({}),
  queryCache: new QueryCache({})
}) */

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

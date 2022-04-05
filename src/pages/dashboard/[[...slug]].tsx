import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { QueryClient, dehydrate } from "react-query";
import { Footer, Main, Box, Tabs, Tab } from "grommet";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getTransactions } from "../../data/hooks";
import { LinkButton, TransactionTable } from "components";

import type { TransactionQueryKey } from "data/types";
import type { Transaction } from "plaid";
import type { NextPage } from "next";

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    const queryClient = new QueryClient();
    const session = getSession(req, res)!;
    const { sub } = session.user;
    const user_id = sub;

    await queryClient.prefetchQuery<
      Transaction[],
      unknown,
      Transaction[],
      TransactionQueryKey
    >(["transactions", { user_id }], getTransactions);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
});

//TODO: Change Favicon
const Dashboard: NextPage = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [tabs] = useState([
/*     {
      name: "transactions",
      content: <TransactionTable />,
    },
 */    {
      name: "receipts",
      content: <Box margin="small">Nothing to show</Box>,
    },
    {
      name: "accounts",
      content: <Box margin="small">Nothing to show</Box>,
    },
  ]);
  const onActive = (nextIndex: number) => {
    const route = `/dashboard/${tabs[nextIndex].name}`;
    router.push(route, route, { shallow: true });
  };

  useEffect(() => {
    const { query } = router;
    const { slug: tab } = query as { slug: (string | null | undefined)[] };
    const tabname = tab?.[0] ?? "transactions";
    if (!tabs.map((tab) => tab.name).includes(tabname)) {
      router.replace("/dashboard", "/dashboard", {
        shallow: true,
      });
    }
    setActiveIndex(tabs.findIndex((tab) => tab.name === tabname) || 0);
  }, [tabs, router]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main justify="center" align="center" margin="large" responsive={true}>
        <LinkButton />
        <Box>
          <Tabs activeIndex={activeIndex} onActive={onActive} justify="start">
            {tabs.map((tab) => (
              <Tab key={tab.name} title={tab.name.toUpperCase()}>
                {tab.content}
              </Tab>
            ))}
          </Tabs>
        </Box>
      </Main>

      <Footer></Footer>
    </>
  );
};

export default Dashboard;

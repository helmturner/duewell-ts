import { useState, useEffect } from "react";
import { QueryClient, dehydrate } from "react-query";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getTransactions } from "data/hooks/useTransactions";

import Head from "next/head";
import { Footer, Main, Box, Tabs, Tab } from "grommet";
import { NewLinkButton, TransactionTable } from "components";

import type { NextPage } from "next";

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(["transactions", {}], getTransactions);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
});

//TODO: Change Favicon
const Dashboard: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [tabs] = useState([
    {
      name: "transactions",
      content: <TransactionTable />,
    },
    {
      name: "receipts",
      content: <Box margin="small">Nothing to show</Box>,
    },
    {
      name: "accounts",
      content: <Box margin="small">Nothing to show</Box>,
    },
  ]);

  useEffect(() => {
    const tabname = tabs[activeIndex].name;
    setActiveIndex(tabs.findIndex((tab) => tab.name === tabname) || 0);
  }, [tabs, activeIndex]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main justify="center" align="center" margin="large" responsive={true}>
        <NewLinkButton />
        <Box>
          <Tabs
            activeIndex={activeIndex}
            onActive={(index) => setActiveIndex(index)}
            justify="start"
          >
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

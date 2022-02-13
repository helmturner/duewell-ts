import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Main } from "grommet";
import RecordEditor from "../components/recordEditor";

const Dashboard: NextPage = () => {
  //TODO: Change Favicon
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" content="User Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main
        justify="center"
        align="center"
        margin="large"
        responsive={true}
      >
        <RecordEditor />
      </Main>

      <footer className={styles.footer}>
      </footer>
    </>
  );
};

export default Dashboard;

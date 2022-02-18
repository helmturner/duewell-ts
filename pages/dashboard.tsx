import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Main } from "grommet";
import RecordEditor from "../components/record-editor";
import AccountBox from "../components/plaid/account-display";
import { useCallback, useContext, useEffect } from "react";
import PlaidContext from "../context/plaid"
import GlobalContext from "../context/global"
import AccountLinker from "../components/plaid/account-linker";
//import PlaidLink from "../components/plaid/link";

const Dashboard: NextPage = () => {
  //TODO: Change Favicon
  const { linkSuccess, isItemAccess, dispatch } = useContext(PlaidContext);
  const { apiBase } = useContext(GlobalContext)

  const generateToken = useCallback(async () => {
    const response = await fetch(`${apiBase}/plaid/create_link_token`, { method: "POST" });
    
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { linkToken: null } });
      return;
    }

    const data = await response.json();
    
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
    }

    localStorage.setItem("link_token", data.link_token); //to use later for Oauth
    console.log(data) // DEBUG
  }, [apiBase, dispatch]);

  const getInfo = useCallback(async () => {
    const response = await fetch(`${apiBase}/plaid/info`, {method: 'POST'})
    
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backendAvailable: false } });
      return;
    }

    const data = await response.json();
    const products = data.products
    
    dispatch({
      type: "SET_STATE",
      state: {
        backendAvailable: true,
        products    
      },
    });
    return;
  }, [apiBase, dispatch])

  useEffect(() => {
    const init = async () => generateToken();
    init();
  }, [dispatch, generateToken, getInfo]);

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
  {/*         <PlaidLink key={'plaid-link'}/> */}
          <RecordEditor key={'record-editor'} />
          <AccountLinker key={'account-linker'}/>
          <AccountBox />
        </Main>
      <footer className={styles.footer}>
      </footer>
    </>
  );
};

export default Dashboard;

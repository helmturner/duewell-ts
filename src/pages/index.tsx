import type { NextPage } from "next";
import Head from "next/head";
import { Footer, Main } from "grommet";

// TODO: Change favicon
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main
        justify="center"
        align="center"
        margin="large"
        responsive={true}
      >
        
      </Main>

      <Footer></Footer>
    </>
  );
};

export default Home;

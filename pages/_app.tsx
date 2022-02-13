import '../styles/globals.css'
import { NextPage } from 'next'
import Layout from "../components/layout"

export default function MyApp({
  Component,
  pageProps: { ...pageProps },
}: {
  //TODO: Better types here?
  Component: NextPage,
  pageProps: JSX.IntrinsicAttributes
}): JSX.Element {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
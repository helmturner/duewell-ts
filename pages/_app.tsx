import '../styles/globals.css'
import { NextPage } from 'next'
import Layout from "../components/layout"
import { UserProvider } from '@auth0/nextjs-auth0'

export default function MyApp({ Component, pageProps: { ...pageProps } }: {
  Component: NextPage, pageProps: JSX.IntrinsicAttributes
}) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
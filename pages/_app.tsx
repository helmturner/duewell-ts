import '../styles/globals.css'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { SessionProvider, useSession } from "next-auth/react"
import Layout from "../components/layout"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: {
  //TODO: Better types here?
  Component: NextPage & {auth: boolean},
  pageProps: JSX.IntrinsicAttributes & {session: Session}
}) {
  return (
    <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>        )}
    </SessionProvider>
  )
}

function Auth({ children }: { children: JSX.Element }): JSX.Element {
  const { data: session, status } = useSession({required: true})
  const isUser = !!session?.user

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useSession } from 'next-auth/react'
import { Main, Heading } from 'grommet'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()
  if (status === "authenticated") {
    if (session) {
      //TODO: Change Favicon
      return (
        <>
          <Head>
            <title>Dashboard</title>
            <meta name="dashboard" content="User Dashboard" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Main justify='center' align='center' margin='large' responsive={true}>
            <Heading>
              Welcome, {session.user?.name || 'friend!'}
            </Heading>

            <p className={styles.description}>
              {"SESSION: " + JSON.stringify(session) + " "}Get started by editing{' '}
              <code className={styles.code}>pages/index.tsx</code>
            </p>

            <div className={styles.grid}>
              <a href="https://nextjs.org/docs" className={styles.card}>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js features and API.</p>
              </a>

              <a href="https://nextjs.org/learn" className={styles.card}>
                <h2>Learn &rarr;</h2>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </a>

              <a
                href="https://github.com/vercel/next.js/tree/master/examples"
                className={styles.card}
              >
                <h2>Examples &rarr;</h2>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </a>

              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}
              >
                <h2>Deploy &rarr;</h2>
                <p>
                  Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
              </a>
            </div>
          </Main>

          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
              </span>
            </a>
          </footer>
        </>
      )
    } else throw new ReferenceError("No Session Found") //FIXME
  } else return null //FIXME
}

export default Dashboard

import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"

//TODO: Move secrets to .env && finish config
export default NextAuth({
  // Configure one or more authentication providers
  secret: "ktg5Iv1y1WYLmGI+hsxz43yAJzvtqhFbxXd0DgY+Phw=",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "XsnMq7pa4mYSDiGCWPJmrXyXy0Z61FiI0unGTxJtiKs=",
    maxAge: 24 * 60 * 60, 
  },
  providers: [
    Auth0Provider({
      clientId: "B0CWuRtObFfi9rXQdrhkrLhwOUxI00pi",
      clientSecret: "4zN0Pgmq38OBq6J8oNsc3L_c_DQ1AuCJmhxt-EzZ0nUdGe5Xvat_RbN8-CTMN7ay",
      issuer: "https://dev-7aw1wy7g.us.auth0.com"
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account, isNewUser, profile, user }) {
      if (account) {
        token.account = {
          type: account.type,
          id: account.providerAccountId,
          accessToken: account.access_token,
          idToken: account.id_token,
          scope: account.scope,
          expiry: account.expires_at,
          tokenType: account.token_type
        }
      }

      if (profile && user) {
        token.user = {
          username: user.name,
          email: profile.email, 
          isNew: isNewUser || false,
          verified: profile.email_verified,
          aud: profile.aud,
          iat: profile.iat,
          exp: profile.exp
        }
      }
      console.log(JSON.stringify(token))
      return token
    }
  }
})
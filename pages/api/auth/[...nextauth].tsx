import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";


/*TODO: Move secrets to .env && add additional providers including:
magic link, credentials (with Auth0 as auth server), google, apple, etc*/
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
    GitHubProvider({
      clientId: "e6dc19b23bc07bd3b7c0",
      clientSecret: "11f3a7c5433a78f4ac86876913c48785cb71e773",
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account, isNewUser, profile, user }) {
      console.log("Token: ", JSON.stringify(token));
      console.log("Account: ", JSON.stringify(account));
      console.log("Profile: ", JSON.stringify(profile));
      console.log("User: ", JSON.stringify(user));
      console.log("New?: ", JSON.stringify(isNewUser));
/*       if (account) {
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
      console.log(JSON.stringify(token)) */
      return token
    }
  }
})
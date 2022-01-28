import NextAuth, { Account, Profile, Session, User } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

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
    async jwt(
      params: { token: JWT, account?: Account, profile?: Profile, isNewUser?: Boolean, user?: User}
    ) {
      let {token, account, profile, isNewUser, user} = params

      if (isNewUser) {
        //TODO: Check that new accounts do not have emails already tied to another account
      }

      if (account) {
        token.account = {
          id: String(account.type) + " | " + String(account.provider) + " | " + String(account.providerAccountId),
          accessToken: account.access_token,
          tokenType: account.token_type
        }
      }

      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
          isNew: isNewUser || false
        }
      }
      if (profile) {
        token.profile = {
          verified: profile.email_verified,
          aud: profile.aud,
          iat: profile.iat,
          exp: profile.exp
        }
      }
      console.log(JSON.stringify(token)); //DEBUG: console log token
      return token
    }, 
    async session(
      { session, token, user }: { session: Session, token: JWT, user: User }
    ): Promise<Session & { id: string }> {
      // Send properties to the client, like an access_token from a provider.
      let account = token.account as Account;
      session.accessToken = token.accessToken
      session.id = {...user, id: account.id }
      return session as Session & {id: string}
    }
  }
})
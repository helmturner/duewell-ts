import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event";

const externalApiBaseUrl = process.env.EXTERNAL_API_BASE;

const teapot: NextApiHandler = (_, res) => {
  res.status(418);
};

const todo: NextApiHandler = (_, res) => {
  res.status(501);
};

const handler: Record<string, NextApiHandler> = {
  put: todo,
  options: todo,
  delete: todo,
  patch: todo,
  default: teapot,
  get: teapot,
  head: teapot,
  connect: teapot,
  trace: teapot,
  post: async (req, res) => {
    try {
      const session = getSession(req, res);

      if (
        !session ||
        !session.idToken ||
        !session.user ||
        !session.accessToken
      ) {
        res.status(401);
        return;
      }

      const {
        user,
        idToken,
        accessToken,
        accessTokenScope,
        accessTokenExpiresAt,
        refreshToken
      } = session;

      const {institution_id, public_token} = req.body

      console.info("user~", user);
      console.info("idToken~", idToken);
      console.info("accessToken~", accessToken);
      console.info("accessTokenExpiresAt~", accessTokenExpiresAt);
      console.info("accessTokenScope~", accessTokenScope);
      console.info("refreshToken", refreshToken);
      console.warn("USER AUTH NOT FULLY IMPLEMENTED");

      //TODO: if session token scopes are not sufficient, return 403 or 404

      const tokenResponse = await fetch(
        "https://dev-7aw1wy7g.us.auth0.com/oauth/token",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: "client_credentials",
          }),
        }
      );

      if (tokenResponse.ok) {
        const { token_type, access_token } = await tokenResponse.json();
        const apiResponse = await fetch(
          `${externalApiBaseUrl}/plaid/items`,
          {
            method: req.method,
            headers: {
              Authorization: `${token_type} ${access_token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ institution_id, public_token, user_id: user.sub }),
          }
        );
        //XXX
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          res.json(data);
        } else console.log("ERROR WITH API RESPONSE", {status: apiResponse.status, text: await apiResponse.text()})
      }
      else {
        res.status(tokenResponse.status)
            .send(tokenResponse.statusText)
      }
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 502).send(error.message);
    }
  },
};

async function transactionHandler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method?.toLowerCase();
  try {
    return handler[method!](req, res);
  } catch {
    return handler.default(req, res);
  }
}

export default withApiAuthRequired(transactionHandler);

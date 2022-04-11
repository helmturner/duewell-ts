import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { fromJson } from "@auth0/nextjs-auth0/dist/session";
import { LinkTokenCreateRequest, LinkTokenCreateResponse } from "plaid";
import { db, plaidClient, PLAID_COUNTRY_CODES, PLAID_PRODUCTS, PLAID_REDIRECT_URI } from "server/db";

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
    const session = fromJson(getSession(req, res)!);

    if (!session || !session.idToken || !session.user || !session.accessToken) {
      res.status(401);
      return;
    }

    const {
      user,
      idToken,
      accessToken,
      accessTokenScope,
      accessTokenExpiresAt,
      refreshToken,
    } = session;

    console.info("user~", user);
    console.info("idToken~", idToken);
    console.info("accessToken~", accessToken);
    console.info("accessTokenExpiresAt~", accessTokenExpiresAt);
    console.info("accessTokenScope~", accessTokenScope);
    console.info("refreshToken", refreshToken);
    console.warn("USER AUTH NOT FULLY IMPLEMENTED");

    //TODO: if session token scopes are not sufficient, return 403 or 404

    const { item_id } = req.body;
    const user_id = user.sub as string;
    let access_token = null;
    let products = PLAID_PRODUCTS;

    if (item_id) {
      // for the link update mode, include access token and an empty products array
      const itemIdResponse = await db.plaidItems.read({ item_id });
      access_token = itemIdResponse?.plaid_access_token;
      products = [];
    }

    const configs: LinkTokenCreateRequest = {
      user: {
        client_user_id: user_id,
      },
      client_name: "DueWell",
      products,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en", //TODO: Move to env var in case of internationalization,
      access_token: access_token,
    };

    if (PLAID_REDIRECT_URI.indexOf("http") === 0) {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    const { data, status, statusText } = await plaidClient.linkTokenCreate(configs);
    const body = status.toString(10).startsWith("2") ? data : statusText;

    res.status(status).send(body);
  },
};

async function linkTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method?.toLowerCase();
  try {
    return handler[method!](req, res);
  } catch {
    return handler.default(req, res);
  }
}

export default withApiAuthRequired(linkTokenHandler);

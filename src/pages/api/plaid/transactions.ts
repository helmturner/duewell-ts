import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";
import { sanitizeTransactions } from "server/utils";

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
    const session = getSession(req, res);

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

    const transactions = await db.transactions.read({
      user_id: req.body.user_id,
    });

    if (transactions.length > 0) {
      res.json(sanitizeTransactions(transactions));
    } else {
      res.json([]);
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

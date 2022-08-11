import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { db, plaidClient } from "db";
import { PlaidItemModel } from "db/types";
import {
  isValidItemStatus,
  sanitizeItems,
  validItemStatuses,
} from "server/utils";

const teapot: NextApiHandler = (_, res) => {
  res.status(418);
};

const todo: NextApiHandler = (_, res) => {
  res.status(501);
};

const handler: Record<string, NextApiHandler> = {
  options: todo,
  patch: todo,
  default: teapot,
  head: teapot,
  connect: teapot,
  trace: teapot,
  put: async (req, res) => {
    const session = getSession(req, res);

    if (!session || !session.idToken || !session.user || !session.accessToken) {
      res.status(401);
      return;
    }

    const item_id = req.query.item_id[0];
    const { status } = req.body;

    if (status) {
      if (!isValidItemStatus(status)) {
        res.status(400).json({
          reason: `${status} is not a valid Item status`,
          acceptedValues: validItemStatuses,
        });
      }
      await db.plaidItems.update({ item_id }, { status });
      const item = await db.plaidItems.read({ item_id });
      res.status(200).json(sanitizeItems(item));
    } else {
      res.status(400).json({
        reason: "You must provide updated item information.",
        acceptedKeys: ["status"],
      });
    }
  },
  delete: async (req, res) => {
    const session = getSession(req, res);

    if (!session || !session.idToken || !session.user || !session.accessToken) {
      res.status(401);
      return;
    }

    let removed: boolean;
    let status_code: number;
    const item_id = req.query.item_id[0];

    const item = await db.plaidItems.read({ item_id });
    const accessToken = item?.access_token;
    const response = await plaidClient.itemRemove({
      access_token: accessToken || "",
    });
    removed = response.data.removed;
    status_code = response.data.status_code;

    if (!removed) return res.status(status_code).send("Failed to delete item");

    await db.plaidItems.delete({ item_id });
    res.status(204).send("Item successfully deleted");
  },
  get: async (req, res) => {
    const session = getSession(req, res);

    if (!session || !session.idToken || !session.user || !session.accessToken) {
      res.status(401);
      return;
    }

    const item_id = req.query.item_id[0];
    try {
      const item = await db.plaidItems.read({ item_id });
      res.status(200).json(sanitizeItems(item));
    } catch (err) {
      res.status(500).json(err);
    }
  },
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
        refreshToken,
      } = session;

      const { institution_id, public_token } = req.body;
      const user_id = user.sub as string;

      console.info("user~", user);
      console.info("idToken~", idToken);
      console.info("accessToken~", accessToken);
      console.info("accessTokenExpiresAt~", accessTokenExpiresAt);
      console.info("accessTokenScope~", accessTokenScope);
      console.info("refreshToken", refreshToken);
      console.warn("USER AUTH NOT FULLY IMPLEMENTED");

      //TODO: if session token scopes are not sufficient, return 403 or 404
      try {
        const existingItem: PlaidItemModel | null = await db.plaidItems.read({
          institution_id,
          user_id,
        });

        if (existingItem) {
          res.status(409).send("You have already linked this institution.");
          return;
        }

        const plaidResponse = await plaidClient.itemPublicTokenExchange({
          public_token,
        });

        if (!plaidResponse.data) {
          res.status(plaidResponse.status).json(plaidResponse); //XXX
        }

        const { acknowledged, insertedId } = await db.plaidItems.create({
          ...plaidResponse.data,
          institution_id,
          user_id,
        });

        if (!acknowledged) {
          res.status(500);
        }

        const newItem = await db.plaidItems.read({ _id: insertedId });

        res.status(200).json(sanitizeItems(newItem));
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      console.log(err);
      throw err;
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
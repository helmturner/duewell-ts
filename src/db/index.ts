import { MongoClient } from "mongodb";
import type { Db } from "mongodb";
import type { Receipt as AzureReceipt } from "@azure/ai-form-recognizer";
import type { Collection } from "mongodb";
import type {
  UserModel,
  UserFilter,
  User,
  ReceiptModel,
  ReceiptFilter,
  Receipt,
  PlaidItemModel,
  PlaidItemFilter,
  PlaidItem,
  TransactionModel,
  TransactionFilter,
  Transaction,
  PlaidApiEventModel,
  PlaidApiEventFilter,
  PlaidApiEvent,
  AccountModel,
  AccountFilter,
  Account,
} from "./types";
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";

export const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
export const PLAID_SECRET = process.env.PLAID_SECRET;
export const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
export const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'us,ca').split(',') as CountryCode[]
export const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',') as Products[];
export const PLAID_REDIRECT_URI = (process.env.PLAID_REDIRECT_URI || '');


const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
});

export const plaidClient = new PlaidApi(configuration);


const handleOrThrow = (err: unknown) => {
  console.log(err);
  throw err;
};

const dbConnect = async () => {
  const uri: string = process.env.DATABASE_URI!;
  const options = undefined;

  let client: Promise<MongoClient>;
  let db: Db;

  if (!uri && !process.env.DATABASE_URI)
    throw new Error("Mongo URI env variable not found");
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    //@ts-ignore
    if (!global._dbClient) {
      client = new MongoClient(uri, options).connect();
      //@ts-ignore
      global._dbClient = await client;
      //@ts-ignore
      db = global._dbClient.db("DueWell");
    }
    //@ts-ignore
    db = global._dbClient.db("DueWell");
  } else {
    // Do not use global var for production
    client = new MongoClient(uri, options).connect();
    const dbClient = await client;
    db = dbClient.db("DueWell");
  }
  const mongo = {
    receipts: db.collection("receipts") as Collection<ReceiptModel>,
    transactions: db.collection("transactions") as Collection<TransactionModel>,
    plaidItems: db.collection("plaid_items") as Collection<PlaidItemModel>,
    plaidApiEvents: db.collection(
      "plaid_api_events"
    ) as Collection<PlaidApiEventModel>,
    accounts: db.collection("accounts") as Collection<AccountModel>,
  };
  return mongo;
};

export const db = {
  receipts: {
    read: async (filter: ReceiptFilter) => {
      const mongo = await dbConnect();
      return mongo.receipts.findOne(filter).catch((err) => handleOrThrow(err));
    },
    create: async (
      receipt: AzureReceipt,
      //TODO:      image: Express.Multer.File,
      force?: boolean
    ) => {
      const mongo = await dbConnect();
      if (!force) {
        const duplicate = await mongo.receipts
          .findOne({ ...receipt.fields })
          .catch((err) => handleOrThrow(err));
        if (duplicate) throw duplicate;
      }
      return mongo.receipts
        .insertOne({
          ...receipt.fields,
        })
        .catch((err) => handleOrThrow(err));
      //TODO: Implement cloud backup for image files and include reference in database document
    },
    update: async () => {
      const mongo = await dbConnect();
      return;
    },
    delete: async () => {
      const mongo = await dbConnect();
      return;
    },
  },
  transactions: {
    read: async (filter: TransactionFilter) => {
      const mongo = await dbConnect();
      return mongo.transactions
        .find(filter)
        ?.limit(5)
        .toArray()
        .catch((err) => handleOrThrow(err));
    },
    create: async () => {
      const mongo = await dbConnect();
      return;
    },
    update: async () => {
      const mongo = await dbConnect();
      return;
    },
    delete: async () => {
      const mongo = await dbConnect();
      return;
    },
  },
  plaidItems: {
    read: async (filter: PlaidItemFilter) => {
      const mongo = await dbConnect();
      return mongo.plaidItems.findOne(filter).catch((err) => handleOrThrow(err));
    },
    create: async (item: PlaidItem) => {
      const mongo = await dbConnect();
      return mongo.plaidItems.insertOne(item).catch((err) => handleOrThrow(err));
    },
    update: async (filter: PlaidItemFilter, item: PlaidItem) => {
      const mongo = await dbConnect();
      return mongo.plaidItems
        .findOneAndUpdate(filter, item)
        .catch((err) => handleOrThrow(err));
    },
    delete: async (item: PlaidItem) => {
      const mongo = await dbConnect();
      return mongo.plaidItems
        .findOneAndDelete(item)
        .catch((err) => handleOrThrow(err));
    },
  },
  plaidApiEvents: {
    read: async () => {
      const mongo = await dbConnect();
      return;
    },
    create: async (event: PlaidApiEvent) => {
      const mongo = await dbConnect();
      return mongo.plaidApiEvents
        .insertOne(event)
        .catch((err) => handleOrThrow(err));
    },
    update: async () => {
      const mongo = await dbConnect();
      return;
    },
    delete: async () => {
      const mongo = await dbConnect();
      return;
    },
  },
  accounts: {
    read: async (account: AccountFilter) => {
      const mongo = await dbConnect();
      return mongo.accounts.findOne(account).catch((err) => handleOrThrow(err));
    },
    create: async () => {
      const mongo = await dbConnect();
      return;
    },
    update: async () => {
      const mongo = await dbConnect();
      return;
    },
    delete: async () => {
      const mongo = await dbConnect();
      return;
    },
  },
};

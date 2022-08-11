import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../schema";

//import { db } from '../../db';

export interface Context {
//  db: typeof db;
}

export function context(): Context {
  return { /*db*/ };
}

const server = new ApolloServer({ schema, context });
await server.start();
const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { typeDefs, resolvers } from './graphql';
import cors from 'cors';
import { dbConnect } from './database/connection';
import { Database } from './lib/types';

const port = 9000;

const mount = async () => {
  const db: Database = await dbConnect();
  const app = express();

  app.use(express.json());
  app.use(cors());

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/api',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, db }),
    })
  );

  httpServer.listen({ port: port }, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

mount();

import { MongoClient } from 'mongodb';
import { Database } from '../lib/types';

export const dbConnect = async (): Promise<Database> => {
  const client = await MongoClient.connect(
     'mongodb://localhost:27017'
  );

  const db = client.db('tinyhouseDb');

  return {
    listings: db.collection('listings'),
  };
};

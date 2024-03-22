import { IResolvers } from 'apollo-server-express';
import { Listing, listings } from '../listings';

export const resolvers: IResolvers = {
  Query: {
    listings: (): Listing[] => {
      return listings;
    },
  },
  Mutation: {
    createListing: (
      _root: undefined,
      { input }: { input: Partial<Listing> }
    ): Listing | Error => {
      const id = String(listings.length + 1);
      const newListing = { id, ...input } as Listing;
      listings.push(newListing);
      return newListing;
    },

    deleteListing: (
      _root: undefined,
      { id }: { id: string }
    ): Listing | Error => {
      for (let i = 0; i < listings.length; i++) {
        if (listings[i].id === id) {
          return listings.splice(i, 1)[0];
        }
      }

      throw new Error('failed to deleted listing');
    },
  },
};

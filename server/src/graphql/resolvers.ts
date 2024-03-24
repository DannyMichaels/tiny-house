// import { IResolvers } from 'apollo-server-express';
import { Database, Listing as TListing } from '../lib/types';
import { WithId } from 'mongodb';

export const resolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _: unknown,
      { db }: { db: Database }
    ): Promise<WithId<TListing[]>[]> => {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { _id }: { _id: TListing['_id'] },
      { db }: { db: Database }
    ): Promise<IterableIterator<TListing>> => {
      const deletedListing = await db.listings.findOneAndDelete({ _id });

      if (!deletedListing?.values?.()) {
        throw new Error('failed to delete listing');
      }

      return deletedListing.values();
    },
  },

  Listing: {
    _id: (listing: TListing): string => listing._id.toString(),
    title: (listing: TListing): string => listing.title.toString(),
    image: (listing: TListing): string => listing.image.toString(),
    address: (listing: TListing): string => listing.address.toString(),
    price: (listing: TListing): number => listing.price,
    numOfGuests: (listing: TListing): number => listing.numOfGuests,
    numOfBeds: (listing: TListing): number => listing.numOfBeds,
    numOfBaths: (listing: TListing): number => listing.numOfBaths,
    rating: (listing: TListing): number => listing.rating,
  },
};

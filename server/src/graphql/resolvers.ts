import { Database, TListing, CreateListingInput } from '../lib/types';
import { WithId, ObjectId, OptionalId } from 'mongodb';

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
    createListing: async (
      _root: undefined,
      { input }: { input: CreateListingInput },
      { db }: { db: Database }
    ): Promise<WithId<TListing[]> | null> => {
      console.log('creating listing');

      const newListing = await db.listings.insertOne(
        input as unknown as OptionalId<TListing[]>
      );

      console.log('newListing', newListing);
      if (!newListing.insertedId) {
        throw new Error('failed to create listing');
      }

      const listing = await db.listings.findOne({
        _id: newListing.insertedId,
      });

      return listing;
    },
    deleteListing: async (
      _root: undefined,
      { _id }: { _id: string },
      { db }: { db: Database }
    ): Promise<WithId<TListing[]>> => {
      console.log('deleting listing', _id);
      const objectId = new ObjectId(_id);
      const deletedListing = await db.listings.findOneAndDelete({
        _id: objectId,
      });

      if (!deletedListing?._id) {
        throw new Error('failed to delete listing');
      }

      return deletedListing;
    },
  },

  Listing: {
    _id: (listing: TListing): string =>
      listing._id ? listing._id.toString() : '',
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

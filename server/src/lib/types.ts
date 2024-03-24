import { ObjectId, Collection } from 'mongodb';

export interface Listing {
  _id?: ObjectId;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListingInput {
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export interface UpdateListingInput {
  title?: string;
  image?: string;
  address?: string;
  price?: number;
  numOfGuests?: number;
  numOfBeds?: number;
  numOfBaths?: number;
  rating?: number;
}

export type TListing = Listing;

export interface Database {
  listings: Collection<Listing[]>;
}

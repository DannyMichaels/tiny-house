import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Listing {
    _id: ID!
    title: String!
    image: String!
    address: String!
    price: Int!
    numOfGuests: Int!
    numOfBeds: Int!
    numOfBaths: Int!
    rating: Int!
  }

  input ListingInput {
    title: String!
    image: String!
    address: String!
    price: Int!
    numOfGuests: Int = 0
    numOfBeds: Int = 0
    numOfBaths: Int = 0
    rating: Int = 0
  }

  type Query {
    listings: [Listing!]!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
    createListing(input: ListingInput!): Listing!
  }
`;

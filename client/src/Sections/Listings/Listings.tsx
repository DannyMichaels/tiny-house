import { server } from '../../lib/api/server';
import {
  Listing,
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
} from './types';
import { useState, useEffect } from 'react';

interface TListingsProps {
  title: string;
}

const GET_LISTINGS = `
  query {
    listings {
      _id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(_id: $id) {
      _id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      rating
    }
  }
`;

export const Listings = ({ title }: TListingsProps): JSX.Element => {
  const [listings, setListings] = useState<Listing[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchListings = async () => {
    const data = await server.fetch<ListingsData>({ query: GET_LISTINGS });
    setListings(data.listings);
    setIsLoading(false);
  };

  const deleteListing = async (id: string) => {
    const data = await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: { id },
    });

    setListings((prevListings) => {
      return prevListings.filter(
        (listing) => listing._id !== data.deleteListing._id
      );
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>{title}</h2>

      {/* <button onClick={fetchListings}>Query Listings!</button> */}
      {/* <button onClick={() => deleteListing('a')}>Delete Listing!</button> */}

      <ul>
        {listings.map((listing) => (
          <li key={listing._id}>
            {listing.title}
            <button onClick={() => deleteListing(listing._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

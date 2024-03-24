import { server } from '../../lib/api/server';

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

export const Listings = ({ title }: TListingsProps): JSX.Element => {
  const fetchListings = async () => {
    const { data } = await server.fetch({ query: GET_LISTINGS });
    console.log(data);
  };

  fetchListings();

  return <h2>{title}</h2>;
};

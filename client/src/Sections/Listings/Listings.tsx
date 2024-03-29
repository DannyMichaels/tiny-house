import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
} from './types';
import { useQuery, useMutation } from '../../hooks';

interface TListingsProps {
  title: string;
}

const LISTINGS = `
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
  const { data, refetch, loading } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const listings = data ? data.listings : [];

  const handleDeleteListing = async (id: string) => {
    const { data } = await deleteListing({ id });
    console.log({ data });
    if (data?.deleteListing?._id) {
      refetch();
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deleting...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Failed to delete listing. Please try again later.</h4>
  ) : null;

  const listingsJSX = (
    <ul>
      {listings.map((listing) => (
        <li key={listing._id}>
          {listing.title}
          <button onClick={() => handleDeleteListing(listing._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2>{title}</h2>

      {listingsJSX}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};

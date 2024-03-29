import { useEffect, useCallback, useReducer } from 'react';
import { server } from '../lib/api/server';

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

type Action<TData> =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: TData }
  | { type: 'FETCH_ERROR' };

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

const reducer = <TData>(
  state: State<TData>,
  action: Action<TData>
): State<TData> => {
  switch (action.type) {
    case 'FETCH':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      throw new Error(`Action type not found`);
  }
};

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const initialState: State<TData> = {
    data: null,
    loading: true,
    error: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        dispatch({ type: 'FETCH' });
        const { data, errors } = await server.fetch<TData>({ query });

        if (errors && errors.length) {
          dispatch({ type: 'FETCH_ERROR' });
          throw new Error(errors[0].message);
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR' });
        throw console.error(error);
      }
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return { ...state, refetch: handleFetch } as QueryResult<TData>;
};

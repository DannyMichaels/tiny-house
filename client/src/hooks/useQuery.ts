import { useState, useEffect, useCallback } from 'react';
import { server } from '../lib/api/server';

interface State<TData> {
  data: TData | null;
  loading: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: true,
  });

  const handleFetch = useCallback(() => {
    const fetchApi = async () => {
      const { data } = await server.fetch<TData>({ query });
      setState({
        data,
        loading: false,
      });
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return {
    ...state,
    refetch: handleFetch,
  };
};

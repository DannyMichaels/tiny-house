import { useState } from 'react';
import { server } from '../lib/api/server';

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: Boolean;
}

type MutationTuple<TData, TVariables> = [
  (variables?: TVariables | undefined) => Promise<{
    data: TData | null;
    loading: boolean;
    error: Boolean;
  }>,
  State<TData>
];

const initialState = {
  data: null,
  loading: false,
  error: false,
};

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  const [state, setState] = useState<State<TData>>(initialState);

  const fetch = async (variables?: TVariables) => {
    try {
      setState({
        ...initialState,
        loading: true,
      });

      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      setState({
        data,
        loading: false,
        error: false,
      });

      return {
        data,
        loading: false,
        error: false,
      };
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: true,
      });
      throw console.error(error);
    }
  };

  return [fetch, state];
};

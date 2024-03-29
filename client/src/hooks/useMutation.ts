import { useReducer, useState } from 'react';
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

type Action<TData> =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: TData }
  | { type: 'FETCH_ERROR' };

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

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  // const [state, setState] = useState<State<TData>>(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetch = async (variables?: TVariables) => {
    try {
      // setState({
      //   ...initialState,
      //   loading: true,
      // });
      dispatch({ type: 'FETCH' });

      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors && errors.length) {
        dispatch({ type: 'FETCH_ERROR' });
        throw new Error(errors[0].message);
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: data });

      return {
        data,
        loading: false,
        error: false,
      };
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR' });
      throw console.error(error);
    }
  };

  return [fetch, state as State<TData>];
};

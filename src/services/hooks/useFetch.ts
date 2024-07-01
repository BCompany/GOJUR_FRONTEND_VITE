import useSWR from 'swr';
import api from '../api';

export function useFetch<Data = any, Error = any>(url: string, args: object) {
  const { data, error, mutate } = useSWR<Data, Error>(
    url,
    async endpoint => {
      const response = await api.post(endpoint, args);

      return response.data;
    },
    {
      revalidateOnFocus: false,
    },
  );
  return { data, error, mutate };
}

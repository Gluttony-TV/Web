import { QueryKey, useQuery, UseQueryOptions } from 'react-query'
import useFetch, { FetchOptions, RequestError } from './useFetch'

export type ResourceOptions<R> = FetchOptions<never> &
   Omit<UseQueryOptions<R, RequestError, R>, 'queryKey' | 'queryFn'> & {
      key?: QueryKey
   }

export default function useResource<R>(
   url: string,
   { key, query = {}, responseType, method, ...options }: ResourceOptions<R> = {}
) {
   const fetcher = useFetch<R>(url, { responseType, method, query })
   return useQuery<R, RequestError, R>(key || url, () => fetcher(), options)
}

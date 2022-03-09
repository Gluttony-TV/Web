import { ApiError } from 'next/dist/server/api-utils'
import { QueryKey, useQuery, UseQueryOptions } from 'react-query'
import useFetch, { FetchOptions } from './useFetch'

export type ResourceOptions<R> = FetchOptions<never> &
   Omit<UseQueryOptions<R, ApiError, R>, 'queryKey' | 'queryFn'> & {
      key?: QueryKey
   }

export default function useResource<R>(
   url: string,
   { key, query = {}, responseType, method, ...options }: ResourceOptions<R> = {}
) {
   const fetcher = useFetch<R>(url, { responseType, method, query })
   return useQuery<R, ApiError, R>(key || url, () => fetcher(), options)
}

import axios, { AxiosRequestConfig } from 'axios'
import { isUndefined, omitBy } from 'lodash'
import { ParsedUrlQueryInput, stringify } from 'querystring'
import { useCallback, useMemo } from 'react'

const API = axios.create({
   baseURL: '/api/',
   responseType: 'json',
   headers: {
      Accept: 'application/json',
   },
})

export type FetchOptions<D> = Pick<AxiosRequestConfig<D>, 'responseType' | 'method' | 'data'> & {
   query?: ParsedUrlQueryInput
}

export default function useFetch<R, D = unknown>(
   endpoint: string,
   { query = {}, method = 'GET', ...options }: FetchOptions<D> = {}
) {
   const url = useMemo(() => {
      const filteredQuery = omitBy(query, isUndefined)
      if (Object.values(filteredQuery).length > 0) return `${endpoint}?${stringify(filteredQuery)}`
      return endpoint
   }, [endpoint, query])

   return useCallback(
      async (additionalOptions?: Partial<FetchOptions<D>>) => {
         const { data } = await API(url, { method, ...options, ...additionalOptions })
         return (typeof data === 'string' ? JSON.parse(data) : data) as R
      },
      [url, method, options]
   )
}

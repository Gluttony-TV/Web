import axios, { AxiosError, AxiosRequestConfig } from 'axios'
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

export class RequestError extends Error {
   constructor(message = 'Unknown server error', public readonly status = 500) {
      super(message)
   }
}

export type FetchOptions<D> = Pick<AxiosRequestConfig<D>, 'responseType' | 'method' | 'data'> & {
   query?: ParsedUrlQueryInput
}

function isAxiosError(e: unknown): e is AxiosError<{ message: string }> {
   return (e as AxiosError).isAxiosError
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
         try {
            const { data } = await API(url, { method, ...options, ...omitBy(additionalOptions, isUndefined) })
            return (typeof data === 'string' && data ? JSON.parse(data) : data) as R
         } catch (e) {
            if (isAxiosError(e))
               throw new RequestError(e.response?.data?.message ?? e.response?.statusText, e.response?.status)
            else throw new RequestError((e as Error).message, 500)
         }
      },
      [url, method, options]
   )
}

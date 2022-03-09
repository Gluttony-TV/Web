import axios, { AxiosRequestConfig, Method } from 'axios'
import { isUndefined, omitBy } from 'lodash'
import { ApiError } from 'next/dist/server/api-utils'
import { ParsedUrlQueryInput, stringify } from 'querystring'
import { useCallback, useMemo } from 'react'
import { QueryKey, useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query'

const API = axios.create({
   baseURL: '/api/',
   responseType: 'json',
   headers: {
      Accept: 'application/json',
   },
})

export default function useFetch<R>(
   endpoint: string,
   {
      key,
      query = {},
      responseType,
      method,
      ...options
   }: {
      key?: QueryKey
      query?: ParsedUrlQueryInput
   } & Omit<UseQueryOptions<R, ApiError, R>, 'queryKey' | 'queryFn'> &
      Pick<AxiosRequestConfig, 'responseType' | 'method'> = {}
) {
   const url = useMemo(() => {
      const filteredQuery = omitBy(query, isUndefined)
      if (Object.values(filteredQuery).length > 0) return `${endpoint}?${stringify(filteredQuery)}`
      return endpoint
   }, [endpoint, query])

   const fetcher = useCallback(async () => {
      const { data } = await API(url ?? key, { method: method ?? 'get', responseType })
      return (typeof data === 'string' ? JSON.parse(data) : data) as R
   }, [key, endpoint])

   return useQuery(key || url, fetcher, options)
}

export function useManipulate<R>(method: Method, url: string, body?: R, invalidates?: string | string[]) {
   const client = useQueryClient()

   const send = useCallback(
      (callbackBody?: R) => {
         const data = body ?? callbackBody
         if (data) client.setQueryData(url, data)
         return API({ url, method, data })
      },
      [method, url, invalidates]
   )

   const invalidate = useCallback(() => {
      const keys = [url, ...(Array.isArray(invalidates) ? invalidates : [invalidates])]
      keys.forEach(key => client.invalidateQueries(key))
   }, [invalidates])

   return useMutation(send, {
      onSuccess: invalidate,
   })
}

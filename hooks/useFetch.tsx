import axios, { Method } from "axios";
import { useCallback } from "react";
import { QueryKey, useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query";

const API = axios.create({
   baseURL: '/api/',
   responseType: 'json',
   headers: {
      'Accept': 'application/json',
   },
})

export default function useFetch<R>(key: string, url?: string, config?: Omit<UseQueryOptions<unknown, unknown, R, QueryKey>, 'queryKey' | 'queryFn'>) {
   const fetcher = useCallback(async () => {
      const { data } = await API.get<R>(url ?? key)
      return typeof data === 'string' ? JSON.parse(data) : data
   }, [key, url])
   return useQuery(key, fetcher, config)
}

export function useManipulate<R>(method: Method, url: string, r1?: R, invalidates?: string | string[]) {
   const client = useQueryClient()

   const send = useCallback((r2: R) => {
      const data = r1 ?? r2
      if (data) client.setQueryData(url, data)
      return API({ url, method, data })
   }, [method, url, invalidates])

   const invalidate = useCallback(() => {
      const keys = [url, ...Array.isArray(invalidates) ? invalidates : [invalidates]]
      keys.forEach(key => client.invalidateQueries(key))
   }, [invalidates])

   return useMutation(send, {
      onSuccess: invalidate,
   })
}
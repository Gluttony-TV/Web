import { SyntheticEvent, useCallback } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import useFetch, { FetchOptions } from './useFetch'

function isEvent<T>(value?: T | SyntheticEvent): value is SyntheticEvent {
   return !!value && 'preventDefault' in value && typeof value.preventDefault === 'function'
}

export type SubmitOptions<R, D> = FetchOptions<D> & {
   mutates?: Record<string, (data: R) => unknown>
}

export default function useSubmit<R, D = unknown>(
   url: string,
   { method = 'POST', mutates = {}, ...options }: SubmitOptions<R, D>
) {
   const client = useQueryClient()

   const fetch = useFetch<R>(url, { method, ...options })
   const send = useCallback(
      (arg?: D | SyntheticEvent) => {
         if (isEvent(arg)) arg.preventDefault()
         const data = isEvent(arg) ? options.data : arg
         return fetch({ data })
      },
      [options.data, fetch]
   )

   return useMutation(send, {
      onSuccess: data => {
         Object.entries(mutates).forEach(([key, supplier]) => {
            client.invalidateQueries(key)
            client.setQueryData(key, supplier(data))
         })
      },
   })
}

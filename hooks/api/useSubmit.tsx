import { SyntheticEvent, useCallback } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import useFetch, { FetchOptions } from './useFetch'

function isEvent<T>(value?: T | SyntheticEvent): value is SyntheticEvent {
   return !!value && 'preventDefault' in value && typeof value.preventDefault === 'function'
}

export type SubmitOptions<D> = FetchOptions<D> & {
   mutates?: Record<string, () => unknown>
}

export default function useSubmit<R, D = unknown>(
   url: string,
   { method = 'POST', data, mutates = {}, ...options }: SubmitOptions<D>
) {
   const client = useQueryClient()

   const fetch = useFetch<R>(url, { method, data, ...options })
   const send = useCallback(
      (arg?: D | SyntheticEvent) => {
         if (isEvent(arg)) {
            arg.preventDefault()
            return fetch()
         } else {
            return fetch({ data: data ?? arg })
         }
      },
      [data, fetch]
   )

   return useMutation(send, {
      onSuccess: () => {
         Object.entries(mutates).forEach(([key, supplier]) => {
            client.invalidateQueries(key)
            client.setQueryData(key, supplier())
         })
      },
   })
}

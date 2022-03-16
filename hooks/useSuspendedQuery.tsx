import { QueryHookOptions, TypedDocumentNode, useQuery as useBaseQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { useEffect, useMemo, useRef } from 'react'

export * from '@apollo/client'

export function useQuery<TData, TVariables>(
   query: DocumentNode | TypedDocumentNode<TData, TVariables>,
   options?: QueryHookOptions<TData, TVariables>
) {
   const { data, error, loading } = useBaseQuery(query, options)

   const resolve = useRef<() => void>()
   const promise = useMemo(
      () =>
         new Promise<void>(res => {
            resolve.current = res
         }),
      []
   )

   useEffect(() => {
      return () => {
         resolve.current?.()
      }
   })

   if (error) throw error
   if (loading) throw promise
   return { data: data as TData }
}

import { QueryHookOptions, TypedDocumentNode, useQuery as useBaseQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { useEffect, useRef } from 'react'

export * from '@apollo/client'

export function useQuery<TData, TVariables>(
   query: DocumentNode | TypedDocumentNode<TData, TVariables>,
   options?: QueryHookOptions<TData, TVariables>
) {
   const ref = useRef<() => void>()
   const { data, error, loading } = useBaseQuery(query, options)

   useEffect(() => {
      if (loading)
         new Promise<void>(res => {
            ref.current = res
         })
      else ref.current?.()
   }, [loading])

   if (error) throw error
   if (loading) throw ref.current
   return { data: data as TData }
}

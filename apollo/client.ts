import { ApolloClient } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { useMemo } from 'react'
import createCache from './cache'

let apolloClient: ApolloClient<unknown> | null = null

function createApolloClient() {
   const link = new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
   })
   return new ApolloClient({
      link,
      cache: createCache(),
   })
}

function initializeApollo(initialState: unknown) {
   const _apolloClient = apolloClient ?? createApolloClient()
   if (initialState) _apolloClient.cache.restore(initialState)
   if (!apolloClient) apolloClient = _apolloClient
   return _apolloClient
}

export function useApollo(initialState: unknown) {
   return useMemo(() => initializeApollo(initialState), [initialState])
}

import { InMemoryCache } from '@apollo/client'
import { customPagination } from 'graphql/pagination'

export default function createCache() {
   return new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               getOwnProgresses: customPagination(),
               getProgressesOf: customPagination(),
            },
         },
      },
   })
}

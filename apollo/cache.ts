import { FieldMergeFunction, InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import { RelayFieldPolicy } from '@apollo/client/utilities/policies/pagination'

function customPagination<T>(...args: Parameters<typeof relayStylePagination>): RelayFieldPolicy<T> {
   const base = relayStylePagination<T>(...args)
   const merge: FieldMergeFunction = (e, i, options) => {
      const args = { ...options.args, ...options.args?.input }
      if (typeof base.merge === 'function') return base.merge(e, i, { ...options, args })
      throw new Error('merge function missing')
   }
   return { ...base, merge }
}

export default function createCache() {
   return new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               getOwnProgresses: customPagination(),
            },
         },
      },
   })
}

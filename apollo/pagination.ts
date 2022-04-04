import { FieldMergeFunction } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import { RelayFieldPolicy } from '@apollo/client/utilities/policies/pagination'
import { ObjectId } from 'bson'
import { PageInfo, PaginationInput, Scalars } from 'generated/graphql'
import { exists } from 'lib/util'
import type { Document, FilterQuery, Model, QueryOptions } from 'mongoose'

export function customPagination<T>(...args: Parameters<typeof relayStylePagination>): RelayFieldPolicy<T> {
   const base = relayStylePagination<T>(...args)
   const merge: FieldMergeFunction = (e, i, options) => {
      const args = { ...options.args, ...options.args?.input }
      if (typeof base.merge === 'function') return base.merge(e, i, { ...options, args })
      throw new Error('merge function missing')
   }
   return { ...base, merge }
}

export interface PaginationConnection<M> {
   edges: Array<{ node: M; cursor: Scalars['Cursor'] }>
   totalCount: number
   pageInfo: PageInfo
}

export async function paginateModel<M>(
   model: Model<M>,
   { after, before, first, last }: PaginationInput,
   baseFilter: FilterQuery<M> = {}
): Promise<PaginationConnection<M>> {
   const asc = true
   const filter: FilterQuery<M & Document> = { ...baseFilter }
   if (before) filter._id = { [asc ? '$lt' : '$gt']: new ObjectId(before) }
   if (after) filter._id = { [asc ? '$gt' : '$lt']: new ObjectId(after) }

   const count = await model.count(filter)

   const options: QueryOptions = {}

   if (exists(first) && count > first) {
      options.limit = first
   } else if (exists(last)) {
      if (options.limit && options.limit > last) {
         options.skip = options.limit - last
      } else if (!options.limit && count > last) {
         options.skip = count - last
      }
   }

   const values = await model.find(filter, {}, options)
   const edges = values.map(node => ({ node, cursor: node._id.toString() }))

   const pageInfo: PageInfo = {
      hasNextPage: exists(first) && count > first,
      hasPreviousPage: exists(last) && count > last,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
   }

   return { pageInfo, totalCount: count, edges }
}

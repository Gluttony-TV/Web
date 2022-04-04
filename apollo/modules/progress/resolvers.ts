import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { ApolloContext } from 'apollo/server'
import { PageInfo, PaginationInput, Resolvers } from 'generated/graphql'
import { exists } from 'lib/util'
import Progresses from 'models/Progresses'
import Users from 'models/Users'
import { ObjectId } from 'mongodb'
import { Document, FilterQuery, Model, QueryOptions } from 'mongoose'

async function guard(id: string, context: ApolloContext) {
   if (id === context.user.id) return
   const user = await Users.findOrFail({ _id: id })
   if (!user.settings.visibility.progress) throw new ForbiddenError('Cannot access private progress')
}

async function paginate<M>(
   model: Model<M>,
   { after, before, first, last }: PaginationInput,
   baseFilter: FilterQuery<M> = {}
) {
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

export const resolvers: Resolvers = {
   Query: {
      async getOwnProgress(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to access your progress')
         return await Progresses.findOne({
            showId: args.show,
            userId: context.user.id,
         })
      },
      async getOwnProgresses(_, args, context) {
         args.input?.after
         if (!context.user) throw new AuthenticationError('You need to be signed in to access your progress')
         return await paginate(Progresses, args.input ?? {}, { userId: context.user.id })
      },
      async getProgressesOf(_, args, context) {
         guard(args.user, context)
         return Progresses.find({ userId: args.user })
      },
      async getProgressOf(_, args, context) {
         guard(args.user, context)
         return Progresses.findOne({ userId: args.user, showId: args.show })
      },
   },
   Mutation: {
      async setWatched(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to modify your progress')
         return await Progresses.findOneAndUpdate(
            { showId: args.show, userId: context.user.id },
            { watched: args.episodes },
            { upsert: true, new: true }
         )
      },
   },
   Show: {
      async progress(show, _, context) {
         if (!context.user) return null
         return await Progresses.findOne({ userId: context.user.id, showId: show.id })
      },
   },
}

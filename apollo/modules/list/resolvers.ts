import { AuthenticationError } from 'apollo-server-micro'
import { NotFoundError } from 'apollo/errors'
import { List, Resolvers } from 'generated/graphql'
import { getShow } from 'lib/api'
import Lists from 'models/Lists'
import { FilterQuery } from 'mongoose'

export const resolvers: Resolvers = {
   Query: {
      async getOwnLists(_, _args, context) {
         if (!context.user) throw new AuthenticationError('You need to be logged in see your lists')
         return await Lists.find({ userId: context.user.id })
      },
      async getListsOf(_, args, context) {
         const query: FilterQuery<List> = { userId: args.user }
         if (args.user !== context.user?.id) query.public = true
         return await Lists.find(query)
      },

      async getList(_, args, context) {
         return await Lists.findOne({ _id: args.id, $or: [{ userId: context.user?.id }, { public: true }] })
      },
      async getOwnList(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be logged in see your lists')
         return await Lists.findOne({ slug: args.slug, userId: context.user.id })
      },
      async getListOf(_, args, context) {
         const query: FilterQuery<List> = { slug: args.slug, userId: args.user }
         if (args.user !== context.user?.id) query.public = true
         return await Lists.findOne(query)
      },

      async isIn(_, { show, ...filter }, context) {
         if (!context.user) throw new AuthenticationError('You need to be logged in see your lists')
         const exists = await Lists.exists({ ...filter, userId: context.user.id, shows: { id: show } })
         return !!exists
      },
   },
   Mutation: {
      async addToList(_, { shows, ...filter }) {
         const addedAt = new Date().toISOString()
         const added = shows.map(id => ({ id, addedAt }))
         const list = await Lists.findOneAndUpdate(filter, { $push: { shows: added } }, { new: true })
         if (!list) throw new NotFoundError('List not found')
         return list
      },
      async removeFromList(_, { shows, ...filter }) {
         const list = await Lists.findOneAndUpdate(
            filter,
            { $pull: { showIds: { id: { $in: shows } } } },
            { new: true }
         )
         if (!list) throw new NotFoundError('List not found')
         return list
      },
   },
   ListEntry: {
      show({ id }) {
         return getShow(id)
      },
   },
}

import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { ApolloContext } from 'apollo/server'
import { Resolvers } from 'generated/graphql'
import Progresses from 'models/Progresses'
import Users from 'models/Users'

async function guard(id: string, context: ApolloContext) {
   if (id === context.user.id) return
   const user = await Users.findOrFail({ _id: id })
   if (!user.settings.visibility.progress) throw new ForbiddenError('Cannot access private progress')
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
      async getOwnProgresses(_, _args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to access your progress')
         return await Progresses.find({ userId: context.user.id })
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

import { AuthenticationError } from 'apollo-server-micro'
import { Resolvers } from 'generated/graphql'
import { getShow } from 'lib/api'
import Progresses from 'models/Progresses'
import Users from 'models/Users'

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
   Progress: {
      show(progress) {
         return getShow(progress.showId)
      },
      user(progress) {
         return Users.findOrFail({ _id: progress.userId })
      },
   },
}

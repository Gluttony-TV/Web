import { AuthenticationError } from 'apollo-server-micro'
import { NotFoundError } from 'apollo/errors'
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
      async getProgressOf(_, args, context) {
         return await Progresses.findOne({
            showId: args.show,
            userId: args.user,
            'settings.visibility.progress': true,
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
         const show = getShow(progress.showId)
         if (!show) throw new NotFoundError('Show not found')
         return show
      },
      async user(progress) {
         const user = await Users.findById(progress.userId)
         if (!user) throw new NotFoundError('User not found')
         return user
      },
   },
}

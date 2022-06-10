import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-micro'
import Ratings from 'database/models/Ratings'
import Users from 'database/models/Users'
import { ApolloContext } from 'graphql/apollo/server'
import { Resolvers } from 'graphql/generated/server'

async function guard(id: string, context: ApolloContext) {
   if (id === context.user?.id) return
   const user = await Users.findOrFail({ _id: id })
   if (!user.settings.visibility.ratings) throw new ForbiddenError('Cannot access private rating')
}

export const resolvers: Resolvers = {
   Query: {
      async getOwnRating(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to access your rating')
         return await Ratings.findOne({
            showId: args.show,
            userId: context.user.id,
         })
      },
      async getOwnRatings(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to access your rating')
         return await Ratings.paginate(args.input, { userId: context.user.id })
      },
      async getRatingsOf(_, args, context) {
         guard(args.user, context)
         return Ratings.paginate(args.input, { userId: args.user })
      },
      async getRatingOf(_, args, context) {
         guard(args.user, context)
         return Ratings.findOne({ userId: args.user, showId: args.show })
      },
   },
   Mutation: {
      async moveAbove(_, args, context) {
         if (!context.user) throw new AuthenticationError('You need to be signed in to modify your ratings')
         if (args.showA === args.showB) throw new UserInputError('Provide two different show IDs')

         const baseFilter = { userId: context.user.id }
         const [ratingA, ratingB] = await Promise.all(
            [args.showA, args.showB].map(showId => Ratings.findOrFail({ ...baseFilter, showId }))
         )

         if (ratingA.position > ratingB.position)
            throw new UserInputError('The first rating must be below the second rating')

         await Promise.all([
            Ratings.updateMany(
               { ...baseFilter, position: { $gt: ratingA.position, $lte: ratingB.position } },
               { $inc: { position: -1 } }
            ),
            Ratings.findByIdAndUpdate(ratingA.id, { position: ratingB.position }),
         ])

         return null
      },
   },
   Show: {
      async rating(show, _, context) {
         if (!context.user) return null
         return await Ratings.findOne({ userId: context.user.id, showId: show.id })
      },
   },
}

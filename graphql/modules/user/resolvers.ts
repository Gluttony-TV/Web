import { AuthenticationError } from 'apollo-server-micro'
import Accounts from 'database/models/Accounts'
import Users from 'database/models/Users'
import { ApolloContext } from 'graphql/apollo/server'
import { Resolvers } from 'graphql/generated/server'

const visibilityFilter = (context: ApolloContext) => ({
   $or: [{ 'settings.visibility.profile': true }, { id: context.user?.id }],
})

export const resolvers: Resolvers = {
   Query: {
      async getUsers(_, _args, context) {
         return await Users.find(visibilityFilter(context))
      },
      getUser(_, args, context) {
         return Users.findOrFail({ _id: args.id, ...visibilityFilter(context) })
      },
      async self(_, _args, context) {
         if (!context.user) throw new AuthenticationError('You need to be logged in to access self')
         return Users.findOrFail({ _id: context.user.id })
      },
   },
   User: {
      async accounts(user) {
         return await Accounts.find({ userId: user.id })
      },
   },
   Progress: {
      user(progress) {
         return Users.findOrFail({ _id: progress.userId })
      },
   },
   List: {
      user(progress) {
         return Users.findOrFail({ _id: progress.userId })
      },
   },
}

import { Resolvers } from 'generated/graphql'
import Users from 'models/Users'
import { ApolloContext } from 'pages/api/graphql'

const visibilityFilter = (context: ApolloContext) => ({
   $or: [{ 'settings.visibility.profile': true }, { id: context.user?.id }],
})

export const resolvers: Resolvers = {
   Query: {
      async getUsers(_, _args, context) {
         return await Users.find(visibilityFilter(context))
      },
      async getUser(_, args, context) {
         return await Users.findOne({ _id: args.id, ...visibilityFilter(context) })
      },
      async self(_, _args, context) {
         return context.user
      },
   },
}

import { Resolvers } from 'generated/queries'
import User from 'models/Users'

export const resolvers: Resolvers = {
   Query: {
      async getUser(_, args) {
         return await User.findById(args.id)
      },
   },
}

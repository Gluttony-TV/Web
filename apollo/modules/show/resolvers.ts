import { Resolvers } from 'generated/queries'
import { getShow } from 'lib/api'

export const resolvers: Resolvers = {
   Query: {
      getShow(_, args) {
         return getShow(args.id)
      },
   },
}

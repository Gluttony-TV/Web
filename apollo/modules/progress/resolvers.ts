import { Resolvers } from 'generated/server'
import { getShow } from 'lib/api'
import Progresses from 'models/Progresses'

export const resolvers: Resolvers = {
   Query: {
      async getProgress(_, args) {
         return await Progresses.findOne({ showId: args.show })
      },
      async progressesOf(_, args) {
         return await Progresses.find({ userId: args.user })
      },
      async setWatched(_, args) {
         await Progresses.updateOne()
      },
   },
   Progress: {
      show(progress) {
         return getShow(progress.id)
      },
   },
}

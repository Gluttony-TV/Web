import { Resolvers } from 'generated/graphql'
import { getEpisodes, getSeason, getShow, getTranslation } from 'lib/api'
import Lists from 'models/Lists'
import Progresses from 'models/Progresses'

export const resolvers: Resolvers = {
   Query: {
      getShow(_, args) {
         return getShow(args.id)
      },
   },
   Show: {
      async isIn(show, filter, context) {
         if (!context.user) return null
         const exists = await Lists.exists({ ...filter, userId: context.user.id, shows: { id: show.id } })
         return !!exists
      },
      async progress(show, _, context) {
         if (!context.user) return null
         return await Progresses.findOne({ userId: context.user.id, showId: show.id })
      },
      async name(show) {
         const translation = await getTranslation(show.id)
         return translation?.name ?? show.name
      },
      async overview(show) {
         const translation = await getTranslation(show.id)
         return translation?.overview ?? show.overview
      },
      async episodes(show) {
         return getEpisodes(show.id)
      },
      //async episodes({ episodes, progress }) {
      //   if (progress) {
      //      console.log('extending episodes')
      //      return episodes.map(e => ({ ...e, watched: progress.watched.includes(e.id) }))
      //   }
      //   return episodes
      //},
      seasons(show) {
         return Promise.all(show.seasons.map(({ id }) => getSeason(id)))
      },
   },
   Episode: {
      async special(episode) {
         return episode.seasonNumber <= 0
      },
      async due({ aired }) {
         return !aired || new Date(aired) > new Date()
      },
      async important({ due, special }) {
         return !due && !special
      },
   },
}

import { Resolvers, Status } from 'generated/graphql'
import { getEpisodes, getSeason, getShow, getTranslation, searchShow } from 'lib/api'
import Lists from 'models/Lists'
import Progresses from 'models/Progresses'

export const resolvers: Resolvers = {
   Query: {
      getShow(_, args) {
         return getShow(args.id)
      },
      searchShows(_, args) {
         return searchShow(args.by, args.limit ?? undefined, args.offset ?? undefined)
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
         return Promise.all(show.seasons.filter(it => it.type.type === 'official').map(it => getSeason(it.id)))
      },
      image(show) {
         return show.image ?? (show as any).image_url
      },
      status(show): Status {
         if (typeof show.status === 'string') return { name: show.status }
         return show.status
      },
      id(show) {
         if (typeof show.id === 'string') return Number.parseInt((show.id as string).substring(7))
         return show.id
      },
   },
   Episode: {
      async special(episode) {
         return episode.seasonNumber <= 0
      },
      async due({ aired }) {
         return !aired || new Date(aired) > new Date()
      },
   },
}

import Lists from 'database/models/Lists'
import { Maybe, Scalars, Status } from 'graphql/generated/models'
import { Resolvers } from 'graphql/generated/server'
import { getEpisodes, getSeason, getShow, getTranslation, searchShow } from 'lib/api'

type NotUndefined<T> = T extends undefined ? Maybe<NonNullable<T>> : T

function translations<M extends { id: Scalars['ApiID']; name?: Maybe<string>; overview?: Maybe<string> }>(
   type: string
) {
   return {
      async name(model: M) {
         const translation = await getTranslation(type, model.id)
         return (translation?.name ?? model.name) as NotUndefined<M['name']>
      },
      async overview(model: M) {
         const translation = await getTranslation(type, model.id)
         return (translation?.overview ?? model.overview) as NotUndefined<M['name']>
      },
   }
}

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
      ...translations('series'),
      async isIn(show, filter, context) {
         if (!context.user) return null
         const exists = await Lists.exists({ ...filter, userId: context.user.id, shows: { id: show.id } })
         return !!exists
      },
      async episodes(show) {
         return getEpisodes(show.id)
      },
      seasons(show) {
         return Promise.all(show.seasons.filter(it => it.type.type === 'official').map(it => getSeason(it.id)))
      },
      status(show): Status {
         if (typeof show.status === 'string') return { name: show.status }
         return show.status
      },
   },
   Season: {
      ...translations('seasons'),
   },
   Episode: {
      //...translations('episodes'),
      name(episode) {
         return episode.name ?? 'WTF!!!'
      },
      async special(episode) {
         return episode.seasonNumber <= 0
      },
      async due({ aired }) {
         return !aired || new Date(aired) > new Date()
      },
   },
   Progress: {
      show(progress) {
         return getShow(progress.showId)
      },
      async episodes(progress) {
         const all = await getEpisodes(progress.showId)
         return all.filter(it => progress.watched.includes(it.id))
      },
   },
   ListEntry: {
      show({ id }) {
         return getShow(id)
      },
   },
}

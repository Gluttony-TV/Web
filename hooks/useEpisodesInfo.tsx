import { groupBy } from 'lodash'
import { useMemo } from 'react'
import { IEpisode, IProgress } from '../models'

export interface IExtendedEpisode extends IEpisode {
   special: boolean
   ignore: boolean
   watched: boolean
   due: boolean
}

export function useEpisodesInfo({ episodes, progress }: { episodes: IEpisode[]; progress?: IProgress }) {
   const now = new Date()

   const extendedEpisodes = useMemo(
      () =>
         episodes.map<IExtendedEpisode>(e => {
            const watched = !!progress?.watched.includes(e.id)
            const special = e.seasonNumber <= 0
            const due = new Date(e.aired) > now
            const ignore = !watched && (special || due)
            return {
               ...e,
               due,
               special,
               watched,
               ignore,
            }
         }),
      [episodes, progress]
   )
   const seasons = useMemo(() => Object.values(groupBy(extendedEpisodes, e => e.seasonNumber)), [extendedEpisodes])
   const aired = useMemo(() => extendedEpisodes.filter(e => !e.due), [extendedEpisodes])
   const watchedAll = useMemo(() => !extendedEpisodes.some(e => !e.ignore && !e.watched), [extendedEpisodes])

   const percentage = useMemo(
      () => (aired.length && progress?.watched.length && (progress.watched.length / aired.length) * 100) ?? 0,
      [aired, progress]
   )

   return { episodes: extendedEpisodes, percentage, watchedAll, seasons }
}

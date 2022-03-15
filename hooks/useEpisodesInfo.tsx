import { Progress } from 'generated/graphql'
import { groupBy } from 'lodash'
import { extendEpisodes, IEpisode } from 'models/Episodes'
import { useMemo } from 'react'

export function useEpisodesInfo({ episodes, progress }: { episodes: IEpisode[]; progress?: Progress }) {
   const extendedEpisodes = useMemo(() => extendEpisodes(episodes, progress), [episodes, progress])
   const seasons = useMemo(() => {
      const grouped = groupBy(extendedEpisodes, e => e.seasonNumber)
      return Object.entries(grouped).map(([number, episodes]) => ({ number, episodes }))
   }, [extendedEpisodes])
   const watchedAll = useMemo(() => !extendedEpisodes.some(e => !e.ignore && !e.watched), [extendedEpisodes])

   const percentage = useMemo(
      () =>
         (progress?.watched.length &&
            (progress.watched.length / extendedEpisodes.filter(it => !it.ignore).length) * 100) ??
         0,
      [extendedEpisodes, progress]
   )

   return { episodes: extendedEpisodes, percentage, watchedAll, seasons }
}

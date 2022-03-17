import { BaseEpisodeFragment, Progress } from 'generated/graphql'

export function extendEpisodes(episodes: BaseEpisodeFragment[], progress?: Progress) {
   const now = new Date()

   return episodes.map<BaseEpisodeFragment>(e => {
      const watched = !!progress?.watched.includes(e.id)
      const special = e.seasonNumber <= 0
      const due = !e.aired || new Date(e.aired) > now
      const ignore = !watched && (special || due)
      return {
         ...e,
         due,
         special,
         watched,
         ignore,
      }
   })
}

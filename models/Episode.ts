import { IProgress } from "./Progress"

export interface IEpisode {
   id: number
   seriesId: number
   name: string
   aired: string
   runtime: number
   nameTranslations: string[]
   overviewTranslations: string[]
   image: string
   imageType: number
   isMovie: number
   number: number
   seasonNumber: number
}

export interface IExtendedEpisode extends IEpisode {
   special: boolean
   ignore: boolean
   watched: boolean
   due: boolean
}

export function extendEpisodes(episodes: IEpisode[], progress?: IProgress) {
   const now = new Date()

   return episodes.map<IExtendedEpisode>(e => {
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
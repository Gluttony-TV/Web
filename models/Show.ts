import { ISeason } from "./Season";

export interface IShow {
   id: number
   tvdb_id: string
   name: string
   slug: string
   image: string
   image_url: string
   thumbnail: string
   first_air_time: string
   next_air_time?: string
   year: string
   score: string
   status: IStatus
   originalCountry: string
   originalLanguage: string
   originalNetwork: INetwork
   aliases?: Alias[]
   translations: Record<string, string>
   overview: string
   overviews?: Record<string, string>
}
export interface IShowFull extends IShow {
   artworks: IArtwork[]
   networks: INetwork[]
   genres: IGenre[]
   characters: ICharacter[]
   airsDays: Record<string, boolean>
   airsTime: string
   seasons: ISeason[]
}

export interface IStatus {
   id: number
   name: string
   recordType: string
   keepUpdated: boolean
}

export interface INetwork {
   id: number
   name: string
   slug: string
   abbreviation: string
   country: string
}

export interface IArtwork {
   id: number
   image: string
   thumbnail: string
   type: number
   score: number[]
}

export interface IGenre {
   id: number
   name: string
   slug: string
}

export interface ICharacter {
   id: number
   name: string
   peopleId?: number | string
   seriesId?: number | string
   movieId?: number | string
   episodeId?: number | string
   type: 3
   image: string
   sort: number
   isFeatured: boolean
   url?: string
   nameTranslations?: string
   overviewTranslations?: string
   person: {
      name: string
      image: string
      score: number
   }
}

export interface ITimestamps {
   created: string
   updated: string
}

export interface Alias {
   language: string
   name: string
}
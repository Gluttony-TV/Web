import { IEpisode } from "./Episode";
import { INetwork } from "./Show";

export interface ISeason {
   id: number
   seriesId: string | number
   type: {
      name: string
      type: string
   }
   name: string
   number: number
   image: string
   imageType: number
   network: INetwork
}

export interface IExtendedSeason {
   id: number
   episodes: IEpisode[]
}
import { IEpisode } from './Episodes'
import { INetwork } from './Shows'

interface ISeason {
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

interface IExtendedSeason {
   id: number
   episodes: IEpisode[]
}

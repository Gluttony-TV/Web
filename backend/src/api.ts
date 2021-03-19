import axios from 'axios'
import Cache from 'node-cache'
import config, { integer } from './config'
import { exists } from './util'

interface Show {
   id: string
   tvdb_id: string
   slug: string
   name: string
   seasons: Array<Season>
}

interface Season {
   id: string
   number?: number
   name: string
   episodes?: Array<Episode>
}

interface Episode {
   id: string
}

class Api {
   private cache = new Cache()
   private token: string | null = null

   constructor() {
      const events = ['set', 'del', 'expired', 'flush']
      events.map(e => this.cache.on(e, key => console.log(`${e}(${key})`)))
   }

   private request = axios.create({ baseURL: config.tvdb.url })

   async login() {
      const { data } = await this.request.post('login', { apikey: config.tvdb.key, pin: config.tvdb.pin })
      if (data.status !== 'success') throw new Error('Unable to login into TVDB API')
      this.token = data.data.token
   }

   async fetch<T>(endpoint: string) {
      try {
         const response = await this.request.get<{ data: T }>(endpoint, {
            headers: {
               Authorization: this.token ? `Bearer ${this.token}` : undefined,
            },
         })
         return response.data.data
      } catch (e) {
         console.warn(`Request to '${endpoint}' failed`)
         console.log(e.response)
         throw new Error(e.message)
      }
   }

   async cacheOr<T>(key: string, getter: () => Promise<T | undefined>, additionalKeys?: (t: T) => string[]): Promise<T | undefined> {
      const cached = this.cache.get<T>(key)
      if (cached) return cached

      const data = await getter()

      if (exists(data)) {
         const keys = [key, ...(additionalKeys?.(data) ?? [])]
         keys.forEach(k => this.cache.set(k, data))
      }

      return data
   }

   async getSeason(id: string | number) {
      return this.cacheOr(`season/${id}`, async () => {
         const season = await this.fetch<Season | null>(`/seasons/${id}/extended`)
         const uniqueEpisodes = season?.episodes?.filter((e1, i1, a) => !a.some((e2, i2) => i2 < i1 && e1.id === e2.id))
         return season && { ...season, episodes: uniqueEpisodes }
      })
   }

   async getShow(name: string) {
      return this.cacheOr(
         `show/${name}`,
         async () => {
            const id = integer(name) ?? this.findId(name)
            if (id) return await this.fetch<Show>(`/series/${id}/extended`)
         },
         s => [s.id, s.slug].map(id => `show/${id}`)
      )
   }

   private async findId(name: string) {
      const results = await this.fetch<(Show | undefined)[]>(`/search?type=series&query=${name}`)
      console.log(results.map(r => r?.name))
      return integer(results[0]?.tvdb_id)
   }
}

const api = new Api()
export default api

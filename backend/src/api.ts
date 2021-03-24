import axios from 'axios'
import Cache from 'node-cache'
import config, { integer } from './config'
import { exists } from './util'

export interface Show {
   id: number
   tvdb_id: string
   slug: string
   name: string
   seasons: Array<Season>
}

interface Season {
   id: number
   number?: number
   name: string
   episodes?: Array<Episode>
}

interface Episode {
   id: number
   runtime: number
}

class Api {
   private cache = new Cache()
   private token: string | null = null

   private request = axios.create({ baseURL: config.tvdb.url })

   async login() {
      const { data } = await this.request.post('login', { apikey: config.tvdb.key, pin: config.tvdb.pin })
      if (data.status !== 'success') throw new Error('Unable to login into TVDB API')
      this.token = data.data.token
   }

   async fetch<T>(endpoint: string) {
      try {
         const response = await this.request.get<{ data: T | undefined }>(endpoint, {
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

   async cacheOr<T>(key: string, getter: () => Promise<T>, additionalKeys?: (t: T) => string[]): Promise<T> {
      const cached = this.cache.get<T>(key)
      if (cached) return cached

      const data = await getter()

      if (exists(data)) {
         const keys = [key, ...(additionalKeys?.(data) ?? [])]
         keys.filter(exists).forEach(k => this.cache.set(k, data))
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

   async getShow(search: string | number, extended = true) {
      const path = (s: string | number) => (extended ? `${s}/extended` : s)

      return this.cacheOr(
         `show/${path(search)}`,
         async () => {
            const id = await this.findId(search)
            if (id) return await this.fetch<Show>(`/series/${path(id)}`)
         },
         s => [s?.id, s?.slug].filter(exists).map(id => `show/${path(id)}`)
      )
   }

   async getShows(page = 0) {
      return this.cacheOr('shows', async () => this.fetch<Show[]>(`series?page=${page}`))
   }

   async getEpisodes(show: string | number) {
      return this.cacheOr(`episodes/${show}`, async () => {
         const id = await this.findId(show)
         const result = await this.fetch<{ episodes: Episode[] }>(`/series/${id}/episodes/official`)

         return result?.episodes
      })
   }

   async searchShow(by: string, limit = 10, offset = 0) {
      const all = await this.cacheOr(`search/${by}/${offset}`, () => this.fetch<(Show | undefined)[]>(`/search?type=series&query=${by}&offset=${offset}`))
      return all?.slice(0, limit)
   }

   private async findId(name: string | number) {
      const id = integer(name)
      if (exists(id)) return id

      const results = await this.searchShow(name.toString())
      console.log(results?.map(r => r?.name))
      return integer(results?.[0]?.tvdb_id)
   }
}

const api = new Api()
export default api

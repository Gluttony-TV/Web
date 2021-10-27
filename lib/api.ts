import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError } from 'next/dist/server/api-utils'
import { IEpisode, IShow, IShowFull } from '../models'
import cacheOr from './cache'

function isAxiosError(err: any): err is AxiosError {
   return err.isAxiosError === true
}

const { TVDB_API_KEY, TVDB_API_PIN } = process.env
global.api = {}

const API = axios.create({ baseURL: 'https://api4.thetvdb.com/v4' })

interface LoginResponse {
   status: string
   data: {
      token: string
   }
}

async function login() {
   console.log('Logging in')
   const { data } = (await API.post('login', { apikey: TVDB_API_KEY, pin: TVDB_API_PIN })) as AxiosResponse<LoginResponse>
   if (data.status !== 'success') throw new Error('Unable to login into TVDB API')
   console.log('Logged in')
   return data.data.token as string
}

async function getToken() {
   const cached = global.api.token ?? (await global.api.token_promise)
   if (cached) return cached
   global.api.token_promise = login()
   global.api.token = await global.api.token_promise
   return global.api.token
}

async function request<R>(endpoint: string, config?: AxiosRequestConfig) {
   try {
      const token = await getToken()

      const { data } = (await API(endpoint, {
         ...config,
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...config?.headers,
         },
      })) as AxiosResponse<{ data: R }>

      return data.data
   } catch (err) {
      if (isAxiosError(err)) console.error(`Request to ${err.request?.path} failed with message`, err.response?.data)
      else if (err instanceof Error) console.error(err.message)
      else console.error(err)
      throw new ApiError(500, (err as Error).message)
   }
}

async function findId(name: string | number) {
   const id = typeof name === 'number' ? name : Number.parseInt(name)
   if (!isNaN(id)) return id

   const results = await searchShow(name.toString())
   const result = results?.[0]
   return result && Number.parseInt(result.tvdb_id)
}

export async function searchShow(by: string, limit = 10, offset = 0) {
   const all = await cacheOr(`search/${by}/${offset}`, () => request<(IShow | undefined)[]>(`/search?type=series&query=${by}&offset=${offset}`))
   return all?.slice(0, limit)
}

export async function getShow<E extends boolean = true>(search: string | number, extended?: E) {
   const path = (s: string | number) => ((extended !== false) ? `${s}/extended` : s)
   return cacheOr(
      `show/${path(search)}`,
      async () => {
         const id = await findId(search)
         if (id) return await request<E extends true ? IShowFull : IShow>(`/series/${path(id)}`)
      },
      s => [s.id, s.slug].map(id => `show/${path(id)}`)
   )
}

export async function getEpisodes(show: string | number) {
   return cacheOr(`episodes/${show}`, async () => {
      const id = await findId(show)
      const result = await request<{ episodes: IEpisode[] }>(`/series/${id}/episodes/official`)

      return result?.episodes
   })
}

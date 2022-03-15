import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BaseShowFragment, Episode, Season, Show } from 'generated/graphql'
import cacheOr from 'lib/cache'
import { exists } from 'lib/util'
import { ApiError } from 'next/dist/server/api-utils'

function isAxiosError(err: unknown): err is AxiosError {
   return (err as AxiosError).isAxiosError === true
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
   const { data } = (await API.post('login', {
      apikey: TVDB_API_KEY,
      pin: TVDB_API_PIN,
   })) as AxiosResponse<LoginResponse>
   if (data.status !== 'success') throw new Error('Unable to login into TVDB API')
   return data.data.token as string
}

async function getToken() {
   const cached = global.api.token ?? (await global.api.token_promise)
   if (cached) return cached
   global.api.token_promise = login()
   global.api.token = await global.api.token_promise
   return global.api.token
}

function request<R>(endpoint: string, config?: AxiosRequestConfig) {
   return cacheOr(endpoint, async () => {
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
   })
}

export async function searchShow(by: string, limit = 10, offset = 0) {
   if (!by) return []
   const all = await request<(Show | undefined)[]>(`/search?type=series&query=${by}&offset=${offset}`)
   return all?.slice(0, limit).filter(exists) ?? []
}

interface Translation {
   name: string
   overview: string
}

export function getTranslation(show: Show['id'], lang = 'eng') {
   return request<Translation>(`series/${show}/translations/${lang}`).catch(() => undefined)
}

export async function getShow(id: Show['id']) {
   return request<Show>(`/series/${id}/extended`)
}

export async function getEpisodes(id: Show['id']) {
   const response = await request<{ episodes: Episode[] }>(`/series/${id}/episodes/official`)
   return response?.episodes
}

export async function getSeason(id: Season['id']) {
   return request<Season>(`/seasons/${id}/extended`)
}

export function getTrendingShows() {
   return request<BaseShowFragment[]>('series/filter?lang=eng&sort=score&year=2021&country=usa')
}

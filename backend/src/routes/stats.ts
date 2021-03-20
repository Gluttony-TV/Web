import { IRouter, Router } from 'express'
import { BaseEntity } from 'typeorm'
import api from '../api'
import requires from '../middleware/requires'
import { wrap } from '../middleware/wrapper'
import Progress from '../models/Progress'

export type StaticEntity<E extends BaseEntity> = typeof BaseEntity & { new (): E }

export default (app: IRouter) => {
   const router = Router()
   router.use(requires())
   app.use('/stats', router)

   router.get(
      '/',
      wrap(async ({ user }) => {
         const progresses = await Progress.find({ user })

         const episodes = await Promise.all(progresses.map(p => api.getEpisodes(p.show)))

         const episodesWatched = progresses.reduce((t, p) => t + p.watched.length, 0)

         const time = progresses
            .map((p, i) => episodes[i]?.filter(e => p.watched.includes(e.id)) ?? [])
            .reduce((a, b) => [...a, ...b], [])
            .reduce((total, episode) => total + episode.runtime, 0)

         const finished = progresses.filter((p, i) => p.watched.length >= (episodes[i]?.length ?? 0)).length
         const watching = progresses.filter((p, i) => p.watched.length < (episodes[i]?.length ?? 0)).length

         const showsWatched = progresses.length

         return { episodesWatched, finished, watching, time, showsWatched }
      })
   )
}

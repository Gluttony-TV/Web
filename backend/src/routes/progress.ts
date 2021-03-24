import { celebrate, Joi } from 'celebrate'
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
   app.use('/progress', router)

   router.get(
      '/',
      wrap(async ({ user }) => Progress.find({ user }))
   )

   router.get(
      '/extended',
      wrap(async ({ user }) => {
         const progresses = await Progress.find({ user })
         return Promise.all(progresses.map(async p => ({ ...p, show: await api.getShow(p.show, false) })))
      })
   )

   router.get(
      '/:show',
      celebrate({
         params: {
            show: Joi.number().required(),
         },
      }),
      wrap(async ({ user, params }) => Progress.findOne({ user, show: Number.parseInt(params.show) }))
   )

   router.put(
      '/:show',
      celebrate({
         params: {
            show: Joi.number().required(),
         },
         body: {
            watched: Joi.array().items(Joi.number()),
         },
      }),
      wrap(async ({ user, params, body }) => {
         const show = Number.parseInt(params.show)
         const progress = (await Progress.findOne({ user, show })) ?? Progress.create({ user, show })
         progress.watched = body.watched
         return progress.save()
      })
   )
}

import { celebrate, Joi } from 'celebrate'
import { IRouter, Router } from 'express'
import { BaseEntity } from 'typeorm'
import api from '../api'
import { wrap } from '../middleware/wrapper'

export type StaticEntity<E extends BaseEntity> = typeof BaseEntity & { new (): E }

export default (app: IRouter) => {
   const router = Router()
   app.use('/show', router)

   const params = celebrate({
      params: {
         slug: Joi.string().required(),
      },
   })

   router.get(
      '/:slug',
      params,
      wrap(async req => api.getShow(req.params.slug))
   )

   router.get(
      '/:slug/seasons',
      params,
      wrap(async req => {
         const show = await api.getShow(req.params.slug)
         if (!show) return show

         const type = show.seasons[0]?.name
         const visible = show.seasons.filter(s => s.name === type && s.number)

         return Promise.all(visible.map(s => api.getSeason(s.id)))
      })
   )
}

import { FilterQuery } from 'mongoose'
import * as Joi from 'types-joi'
import validate from '../../../../lib/validate'
import withSession, { methodSwitch } from '../../../../lib/wrapper'
import List from '../../../../models/List'

const get = withSession(async (req, res, session) => {
   const { query } = validate(req, {
      query: {
         visibility: Joi.string().allow('public', 'private'),
      },
   })

   const filter: FilterQuery<List> = { user: session.user.id }
   if (query.visibility) filter.public = query.visibility === 'public'
   const lists = await List.find(filter)
   res.json(lists)
})

const post = withSession(async (req, res, session) => {
   const { body } = validate(req, {
      body: {
         name: Joi.string().required(),
         public: Joi.boolean().optional(),
         shows: Joi.array().items(Joi.number()).default([]),
      },
   })

   const created = await List.create({ ...body, user: session.user.id })
   res.json(created)
})

export default methodSwitch({ get, post })
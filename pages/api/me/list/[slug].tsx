import validate from 'lib/validate'
import withSession, { methodSwitch } from 'lib/wrapper'
import List, { IList } from 'models/Lists'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import * as Joi from 'types-joi'

function getSlug(req: NextApiRequest) {
   const { query } = validate(req, {
      query: {
         slug: Joi.string().required(),
      },
   })

   return query.slug
}

const get = withSession(async (req, res, session) => {
   const slug = getSlug(req)
   const list = await List.findOne({ userId: session.user.id, slug }, { shows: false })

   if (list) {
      res.json(list)
   } else {
      throw new ApiError(404, 'List not found')
   }
})

const put = withSession(async (req, res, session) => {
   const { body } = validate(req, {
      body: {
         name: Joi.string().optional(),
         public: Joi.boolean().optional(),
         add: Joi.array().items(Joi.number()).default([]),
         remove: Joi.array().items(Joi.number()).default([]),
      },
   })

   const slug = getSlug(req)

   const { add, remove, ...values } = body

   const now = new Date().toString()

   const added = add.map(id => ({ id, addedAt: now }))

   const updateQuery: UpdateQuery<IList> = { ...values }
   if (added.length) updateQuery.$push = { showIds: added }
   else if (remove.length) updateQuery.$pull = { showIds: { id: { $in: remove } } }

   await List.updateOne({ userId: session.user.id, slug }, updateQuery, { upsert: true })

   res.json(true)
})

export default methodSwitch({ get, put })

import { UpdateQuery } from 'mongoose'
import { NextApiRequest } from 'next'
import * as Joi from 'types-joi'
import validate from '../../../../lib/validate'
import withSession, { methodSwitch } from '../../../../lib/wrapper'
import List, { IList } from '../../../../models/List'

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
   const list = await List.findOne({ user: session.user.id, slug }, { shows: false })

   if (list) {
      res.json(list)
   } else {
      res.status(404).send(null)
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
   if (added.length) updateQuery.$push = { shows: added }
   else if (remove.length) updateQuery.$pull = { shows: { id: { $in: remove } } }

   await List.updateOne({ user: session.user.id, slug }, updateQuery, { upsert: true })

   res.json(true)
})

export default methodSwitch({ get, put })

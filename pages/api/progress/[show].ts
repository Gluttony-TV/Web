import Joi from 'joi'
import { NextApiRequest } from 'next'
import validate from '../../../lib/validate'
import withSession, { methodSwitch } from '../../../lib/wrapper'
import Progress from '../../../models/Progress'

function showId(req: NextApiRequest) {
   validate(req, {
      query: {
         show: Joi.number(),
      },
   })
   return Number.parseInt(req.query.show as string)
}

const get = withSession(async (req, res, session) => {
   const show = showId(req)
   const progress = await Progress.findOne({ user: session.user.email, show })
   res.json(progress)
})

const put = withSession(async (req, res, session) => {
   validate(req, {
      body: {
         watched: Joi.array().items(Joi.number()),
      },
   })

   const show = showId(req)
   await Progress.updateOne({ user: session.user.email, show }, req.body, { upsert: true })

   res.status(204).send(null)
})

export default methodSwitch({ get, put })

import * as Joi from 'types-joi'
import validate from '../../../../lib/validate'
import withSession, { methodSwitch } from '../../../../lib/wrapper'
import List from '../../../../models/List'

const get = withSession(async (req, res, session) => {
   validate(req, {
      query: {
         show: Joi.string(),
      },
   })

   const show = req.query.show as string
   const lists = await List.find({ user: session.user.id, show })

   res.json(lists)
})

export default methodSwitch({ get })

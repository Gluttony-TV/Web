import * as Joi from 'types-joi'
import validate from '../../../../lib/validate'
import withSession, { methodSwitch } from '../../../../lib/wrapper'
import List from '../../../../models/List'

const get = withSession(async (req, res, session) => {
   const { query } = validate(req, {
      query: {
         show: Joi.number().required(),
      },
   })

   const lists = await List.find({ user: session.user.id, shows: { $elemMatch: { id: query.show } } })

   res.json(lists)
})

export default methodSwitch({ get })

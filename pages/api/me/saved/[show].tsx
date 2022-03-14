import validate from 'lib/validate'
import withSession, { methodSwitch } from 'lib/wrapper'
import List from 'models/Lists'
import * as Joi from 'types-joi'

const get = withSession(async (req, res, session) => {
   const { query } = validate(req, {
      query: {
         show: Joi.number().required(),
      },
   })

   const lists = await List.find({ userId: session.user.id, showIds: { $elemMatch: { id: query.show } } })

   res.json(lists)
})

export default methodSwitch({ get })

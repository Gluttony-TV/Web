import validate from 'lib/validate'
import { forMethod } from 'lib/wrapper'
import User from 'models/Users'
import { ApiError } from 'next/dist/server/api-utils'
import Joi from 'types-joi'

export default forMethod('get', async (req, res) => {
   const { query } = validate(req, {
      query: {
         id: Joi.string().required(),
      },
   })

   const user = await User.findOne({ _id: query.id, 'settings.visibility.profile': true })

   if (user) {
      res.json(user)
   } else {
      throw new ApiError(404, 'User not found')
   }
})

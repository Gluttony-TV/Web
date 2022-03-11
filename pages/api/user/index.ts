import { forMethod } from '../../../lib/wrapper'
import User from '../../../models/User'

export default forMethod('get', async (_, res) => {
   const users = await User.find({ 'settings.visibility.profile': true })
   res.json(users)
})

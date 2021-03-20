import UnauthorizedError from '../error/UnauthorizedError'
import User from '../models/User'
import { RequestHandler } from './wrapper'

export default (validate: (user: User) => boolean = () => true): RequestHandler => (req, _, next) => {
   if (req.authError) next(req.authError)
   if (!req.user || !validate(req.user)) next(new UnauthorizedError())
   next()
}

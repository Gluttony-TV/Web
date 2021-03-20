import { NextFunction, Request, Response } from 'express'
import { BaseEntity } from 'typeorm'
import { stripHidden } from '../decorators/Hidden'
import NotFoundError from '../error/NotFoundError'
import Session from '../models/Session'
import User from '../models/User'

export type RequestHandler<R extends Request = Request> = (req: R, res: Response, next: NextFunction) => unknown
export type ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => unknown

export interface AuthRequest extends Request {
   user: User
   session: Session
}

export function wrap(func: RequestHandler) {
   return (async (req: Request, res: Response, next: NextFunction) => {
      try {
         const response = await func(req, res, next)

         if (response === null || response === undefined) throw new NotFoundError()
         else if (response === true) res.status(200).send()
         else if (response) res.send(response instanceof BaseEntity ? stripHidden(response) : response)
      } catch (e) {
         next(e)
      }
   }) as RequestHandler
}

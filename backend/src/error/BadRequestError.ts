import HttpError from './HttpError'

export default class BadRequestError extends HttpError {
   constructor(message = 'Bad Request', public readonly source?: string) {
      super(message, 400)
   }
}

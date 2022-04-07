import { ApolloError } from 'apollo-server-micro'

export class NotFoundError extends ApolloError {
   constructor(message: string, extensions?: ApolloError['extensions']) {
      super(message, 'NOT_FOUND', extensions)
   }
}

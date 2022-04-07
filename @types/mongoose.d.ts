import { InputMaybe, PaginationInput } from 'graphql/generated/models'
import { PaginationConnection } from 'graphql/pagination'
import 'mongoose'

declare module 'mongoose' {
   interface Model<T> {
      findOrFail(...parameters: Parameters<typeof this.findOne>): Promise<T>
      paginate(input?: InputMaybe<PaginationInput>, filter?: FilterQuery<T> | null): Promise<PaginationConnection<T>>
   }
}

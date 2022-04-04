import { PaginationConnection } from 'apollo/pagination'
import { InputMaybe, PaginationInput } from 'generated/graphql'
import 'mongoose'

declare module 'mongoose' {
   interface Model<T> {
      findOrFail(...parameters: Parameters<typeof this.findOne>): Promise<T>
      paginate(input?: InputMaybe<PaginationInput>, filter?: FilterQuery<T> | null): Promise<PaginationConnection<T>>
   }
}

import 'mongoose'

declare module 'mongoose' {
   interface Model<T> {
      findOrFail(...parameters: Parameters<typeof this.findOne>): Promise<T>
   }
}

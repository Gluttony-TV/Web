import { Schema } from 'mongoose'
import { define } from '../lib/database'

export interface IUser {
   name: string
   email?: string
   image?: string
   emailVerified: boolean
}

const schema = new Schema({
   name: {
      type: String,
      required: true,
   },
   email: String,
   image: String,
   emailVerified: {
      type: Boolean,
      default: false,
   },
})

schema.index({ email: 1 }, { unique: true })

export default define<IUser>('User', schema)

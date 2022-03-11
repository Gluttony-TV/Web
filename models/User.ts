import { Schema } from 'mongoose'
import { define } from '../lib/database'
import Settings, { ISettings } from './Settings'

export interface IUser {
   id: string
   joinedAt: string
   name: string
   email?: string
   image?: string
   emailVerified: boolean
   settings: ISettings
   seeded?: boolean
}

const schema = new Schema({
   joinedAt: {
      type: Date,
      default: () => new Date(),
   },
   name: {
      type: String,
      required: true,
   },
   email: String,
   image: String,
   seeded: Boolean,
   emailVerified: {
      type: Boolean,
      default: false,
   },
   settings: {
      type: Settings,
      required: true,
   },
})

schema.set('toJSON', { virtuals: true })

schema.index({ email: 1 }, { unique: true })

export default define<IUser>('User', schema)

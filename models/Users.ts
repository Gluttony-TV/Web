import { User } from 'generated/graphql'
import { define } from 'lib/database'
import { Schema } from 'mongoose'
import Settings from './Settings'

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

export default define<User>('User', schema)

import { define } from 'database'
import { User } from 'graphql/generated/models'
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

schema.index({ email: 1 }, { unique: true })

export default define<User>('User', schema, { limit: 30 })

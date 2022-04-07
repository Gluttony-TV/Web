import { define } from 'database'
import { Progress } from 'graphql/generated/models'
import { Schema, Types } from 'mongoose'

const schema = new Schema({
   userId: {
      type: Types.ObjectId,
      required: true,
   },
   showId: {
      type: Number,
      required: true,
   },
   watched: {
      type: [Number],
   },
})

schema.index({ user: 1, show: -1 }, { unique: true })

export default define<Progress>('Progress', schema, { limit: 20 })

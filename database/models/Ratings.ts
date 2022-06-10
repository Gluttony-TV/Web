import { define } from 'database'
import { Rating } from 'graphql/generated/models'
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
   position: {
      type: Number,
      required: true,
   },
})

schema.index({ userId: 1, showId: -1 }, { unique: true })

export default define<Rating>('Rating', schema, { limit: 20 })

import { Schema, Types } from 'mongoose'
import { define } from '../lib/database'
import { IProgress } from '../models'

const schema = new Schema({
   user: {
      type: Types.ObjectId,
      required: true,
   },
   show: {
      type: Number,
      required: true,
   },
   watched: {
      type: [Number],
   },
})

schema.index({ user: 1, show: -1 }, { unique: true })

export default define<IProgress>('Progress', schema)

import { Schema, Types } from 'mongoose'
import { define } from '../lib/database'

interface ISettings {
   visibility: {
      progress: boolean
      favourites: boolean
   }
}

const schema = new Schema({
   userId: {
      type: Types.ObjectId,
      required: true,
   },
   visibility: {
      progress: {
         type: Boolean,
         default: false,
      },
      favourites: {
         type: Boolean,
         default: false,
      },
   },
})

schema.index({ userId: 1 }, { unique: true })

export default define<ISettings>('Settings', schema)

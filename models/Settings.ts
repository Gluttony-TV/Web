import { Schema, Types } from 'mongoose'
import { define } from '../lib/database'

export interface ISettings {
   _id: string
   user: string
   visibility: {
      profile: boolean
      progress: boolean
      favourites: boolean
   }
}

const schema = new Schema({
   user: {
      type: Types.ObjectId,
      required: true,
      unique: true,
   },
   visibility: {
      profile: {
         type: Boolean,
         default: false,
      },
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

export default define<ISettings>('Settings', schema)

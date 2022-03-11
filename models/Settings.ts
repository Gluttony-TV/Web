import { Schema } from 'mongoose'

export interface ISettings {
   visibility: {
      profile: boolean
      progress: boolean
      favourites: boolean
   }
}

const Settings = new Schema({
   visibility: {
      profile: {
         type: Boolean,
         default: true,
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

export default Settings

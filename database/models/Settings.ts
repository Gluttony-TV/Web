import { Schema } from 'mongoose'

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
      ratings: {
         type: Boolean,
         default: false,
      },
   },
})

export default Settings

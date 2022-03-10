import { createFactory } from '..'
import Settings from '../../models/Settings'

createFactory(Settings, faker => {
   return {
      visibility: {
         profile: true,
         favourites: faker.datatype.boolean(),
         progress: faker.datatype.boolean(),
      },
   }
})

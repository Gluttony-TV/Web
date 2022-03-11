import { createFactory } from '..'
import { ISettings } from '../../models/Settings'
import User from '../../models/User'

createFactory(User, faker => {
   const name = faker.name.firstName()
   const email = faker.internet.email(name, undefined, 'example.com')
   const emailVerified = true
   const joinedAt = faker.date.past(3).toISOString()

   const settings: ISettings = {
      visibility: {
         profile: true,
         favourites: faker.datatype.boolean(),
         progress: faker.datatype.boolean(),
      },
   }

   return { name, email, emailVerified, settings, joinedAt, seeded: true }
})

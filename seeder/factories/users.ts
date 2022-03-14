import { Settings } from 'generated/server'
import User from 'models/Users'
import { createFactory } from '..'

createFactory(User, faker => {
   const name = faker.name.firstName()
   const email = faker.internet.email(name, undefined, 'example.com')
   const emailVerified = true
   const joinedAt = faker.date.past(3).toISOString()

   const settings: Settings = {
      visibility: {
         profile: true,
         favourites: faker.datatype.boolean(),
         progress: faker.datatype.boolean(),
      },
   }

   return { name, email, emailVerified, settings, joinedAt, seeded: true }
})

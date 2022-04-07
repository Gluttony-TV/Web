import Users from 'database/models/Users'
import { Settings } from 'graphql/generated/models'
import { createFactory } from '..'

createFactory(Users, faker => {
   const name = faker.name.firstName()
   const email = faker.internet.email(name, undefined, 'example.com')
   const emailVerified = true
   const joinedAt = faker.date.past(3).getTime()

   const settings: Settings = {
      visibility: {
         profile: true,
         favourites: faker.datatype.boolean(),
         progress: faker.datatype.boolean(),
      },
   }

   return { name, email, emailVerified, settings, joinedAt, seeded: true }
})

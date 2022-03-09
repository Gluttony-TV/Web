import { createFactory } from '..'
import User from '../../models/User'

createFactory(User, faker => {
   const name = faker.name.firstName()
   const email = faker.internet.email(name)
   const emailVerified = true
   return { name, email, emailVerified }
})

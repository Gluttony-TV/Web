import faker from '@faker-js/faker'
import { readdirSync } from 'fs'
import database from 'lib/database'
import Progress from 'models/Progresses'
import User from 'models/Users'
import { join, resolve } from 'path'
import { factory } from '.'

async function run() {
   await database()
   //const db = await database()
   //await db.connection.dropCollection('users')

   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   const users = await factory(User).createMany(20)
   await Promise.all(
      users.map(u => factory(Progress).createMany(faker.datatype.number({ min: 3, max: 20 }), { userId: u.id }))
   )
}

run().then(() => process.exit(0))

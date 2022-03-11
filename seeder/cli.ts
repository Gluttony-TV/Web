import faker from '@faker-js/faker'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { factory } from '.'
import database from '../lib/database'
import Progress from '../models/Progress'
import User from '../models/User'

async function run() {
   await database()
   //const db = await database()
   //await db.connection.dropCollection('users')

   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   const users = await factory(User).createMany(100)
   await Promise.all(
      users.map(u => factory(Progress).createMany(faker.datatype.number({ min: 3, max: 20 }), { user: u.id }))
   )
}

run().then(() => process.exit(0))

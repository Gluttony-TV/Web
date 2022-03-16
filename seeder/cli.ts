import faker from '@faker-js/faker'
import { readdirSync } from 'fs'
import database from 'lib/database'
import Lists from 'models/Lists'
import Progresses from 'models/Progresses'
import Users from 'models/Users'
import { join, resolve } from 'path'
import { factory } from '.'

async function run() {
   const db = await database()
   await db.connection.dropDatabase()

   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   const users = await factory(Users).createMany(20)
   await Promise.all(
      users.map(u =>
         Promise.all([
            factory(Progresses).createMany(faker.datatype.number({ min: 3, max: 20 }), { userId: u.id }),
            factory(Lists).create({ userId: u.id, primary: true, name: 'Favourites' }),
         ])
      )
   )
}

run().then(() => process.exit(0))
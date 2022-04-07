import faker from '@faker-js/faker'
import database from 'database'
import Lists from 'database/models/Lists'
import Progresses from 'database/models/Progresses'
import Users from 'database/models/Users'
import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { getTrendingShows } from 'lib/api'
import { join, resolve } from 'path'
import { factory } from '.'

config({ path: './.env.local' })

async function run() {
   const db = await database()
   await db.connection.dropDatabase()
   console.log('Dropped Database')

   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   const users = await factory(Users).createAmount(200)
   const shows = await getTrendingShows()
   await Promise.all(
      users.map(async u => {
         await factory(Progresses).createMany(
            faker.random
               .arrayElements(shows, faker.datatype.number({ min: 8, max: 30 }))
               .map(show => ({ userId: u.id, showId: show.id }))
         )
         await factory(Lists).create({ userId: u.id, primary: true, name: 'Favourites' })
         await factory(Lists).createAmount(faker.datatype.number({ min: 0, max: 7 }), {
            userId: u.id,
            name: faker.lorem.word(),
         })
      })
   )
}

run().then(() => process.exit(0))

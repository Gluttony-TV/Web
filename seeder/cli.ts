import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { factory } from '.'
import database from '../lib/database'
import Settings from '../models/Settings'
import User from '../models/User'

async function run() {
   await database()
   //await db.connection.dropCollection('users')
   //await db.connection.dropCollection('settings')

   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   const users = await factory(User).createMany(10)
   await Promise.all(users.map(({ _id }) => factory(Settings).create({ user: _id })))
}

run().then(() => process.exit(0))

import { mkdirSync, unlinkSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { runSeeder, tearDownDatabase, useSeeding } from 'typeorm-seeding'
import { EntityFactory } from 'typeorm-seeding/dist/entity-factory'
import config from '../config'
import databaseLoader from '../database'
import User, { UserRole } from '../models/User'
import UserSeeder from './seeds/user.seed'

export type Faked<T> = {
   [P in keyof T]: T[P] | undefined | EntityFactory<T[P], unknown> | Promise<T[P]>
}

async function run() {
   await databaseLoader()

   const configName = join('temp', 'ormconfig.json')

   mkdirSync(dirname(configName), { recursive: true })
   writeFileSync(configName, JSON.stringify(config.database, null, 2))

   console.log('Database loaded')

   await User.delete({ role: UserRole.FAKE })
   console.log('Database refreshed')

   await useSeeding({ configName })
   console.log('Seeds loaded')

   await runSeeder(UserSeeder)

   unlinkSync(configName)
   await tearDownDatabase()
}

run()
   .then(() => process.exit(0))
   .catch(e => {
      console.error(e)
      process.exit(-1)
   })

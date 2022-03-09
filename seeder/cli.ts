import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { factory, runFactories } from '.'
import User from '../models/User'

async function run() {
   const dir = resolve(__dirname, 'factories')
   const factories = readdirSync(dir)

   factories.forEach(file => {
      require(join(dir, file))
   })

   factory(User).createMany(10)

   await runFactories()
}

run().then(() => process.exit(0))

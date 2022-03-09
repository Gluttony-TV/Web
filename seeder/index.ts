import { faker, Faker } from '@faker-js/faker'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { Model } from 'mongoose'
import database from '../lib/database'

config({ path: './.env.local' })

type Builder<M> = (faker: Faker) => M

class Factory<M> {
   constructor(private builder: Builder<M>) {}

   private CREATED: M[] = []

   create() {
      const created = this.builder(faker)
      this.CREATED.push(created)
      return created
   }

   createMany(amount: number) {
      return new Array(amount).fill(null).map(() => this.create())
   }

   async run(model: Model<M>) {
      console.log('creating', this.CREATED.length, model.modelName)
      await model.insertMany(this.CREATED.map(m => ({ ...m, _id: new ObjectId() })))
   }
}

const FACTORIES = new Map<Model<any>, Factory<any>>()

export function createFactory<M>(model: Model<M>, builder: Builder<M>) {
   const factory = new Factory(builder)
   FACTORIES.set(model, factory)
}

export function factory<M>(model: Model<M>): Factory<M> {
   const factory = FACTORIES.get(model)
   if (factory) return factory
   throw new Error(`Factory missing for ${model.modelName}`)
}

export async function runFactories() {
   await database()
   const factories = [...FACTORIES.entries()]
   await Promise.all(factories.map(([model, factory]) => factory.run(model)))
}

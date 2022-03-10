import { faker, Faker } from '@faker-js/faker'
import { config } from 'dotenv'
import { Model } from 'mongoose'
import { DeepPartial } from '../lib/util'

config({ path: './.env.local' })

type Builder<M> = (faker: Faker) => DeepPartial<M>

class Factory<M> {
   constructor(private builder: Builder<M>, private model: Model<M>) {}

   private build(ctx: DeepPartial<M>) {
      return { ...this.builder(faker), ...ctx }
   }

   async create(ctx: DeepPartial<M> = {}) {
      const created = this.build(ctx)
      return this.model.insertMany(created)
   }

   async createMany(amount: number, ctx: DeepPartial<M> = {}) {
      const created = new Array(amount).fill(null).map(() => this.build(ctx))
      return this.model.insertMany(created)
   }
}

const FACTORIES = new Map<Model<any>, Factory<any>>()

export function createFactory<M>(model: Model<M>, builder: Builder<M>) {
   const factory = new Factory(builder, model)
   FACTORIES.set(model, factory)
}

export function factory<M>(model: Model<M>): Factory<M> {
   const factory = FACTORIES.get(model)
   if (factory) return factory
   throw new Error(`Factory missing for ${model.modelName}`)
}

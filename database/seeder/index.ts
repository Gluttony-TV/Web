import { faker, Faker } from '@faker-js/faker'
import { DeepPartial } from 'lib/util'
import { Model } from 'mongoose'

type Builder<M> = (faker: Faker, ctx: DeepPartial<M>) => DeepPartial<M> | Promise<DeepPartial<M>>

class Factory<M> {
   constructor(private builder: Builder<M>, private model: Model<M>) {}

   private async build(ctx: DeepPartial<M>) {
      return { ...(await this.builder(faker, ctx)), ...ctx }
   }

   async create(ctx: DeepPartial<M> = {}) {
      console.log(`Created one ${this.model.modelName}`)
      const created = await this.build(ctx)
      return this.model.insertMany(created)
   }

   async createAmount(amount: number, ctx: DeepPartial<M> = {}) {
      const values = await Promise.all(new Array(amount).fill(null).map(() => ctx))
      return this.createMany(values)
   }

   async createMany(values: DeepPartial<M>[]) {
      const created = await Promise.all(values.map(ctx => this.build(ctx)))
      const inserted = await this.model.insertMany(created)
      console.log(`Created ${inserted.length} ${this.model.modelName}`)
      return inserted
   }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

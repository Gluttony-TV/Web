import { DateTime } from 'luxon'
import mongoose, { ConnectOptions, Document, Model, Schema, Types } from 'mongoose'
import { env } from './util'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) cached = global.mongo = { conn: undefined, promise: undefined }

async function database() {
   const MONGODB_URI = env('DB_URI')

   if (cached.conn) return cached.conn

   if (!cached.promise) {
      const opts: ConnectOptions = {
         bufferCommands: false,
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts)
   }
   cached.conn = await cached.promise
   return cached.conn
}

export function define<M>(name: string, schema: Schema<Document & M>): Model<M> {
   return mongoose.models[name] ?? mongoose.model<M>(name, schema)
}

type Base = number | string | boolean
type SerializedObject<T> = { [P in keyof T]: Serialized<T[P]> }
type SerializedModel<T> = Omit<SerializedObject<T>, Exclude<keyof Document, 'id'>>

// prettier-ignore
export type Serialized<T> = 
     T extends Date ? string 
   : T extends DateTime ? string 
   : T extends Array<infer I> ? Array<Serialized<I>>
   : T extends Base ? T 
   : T extends null ? undefined 
   : T extends Types.ObjectId ? string 
//   : T extends Document<unknown, unknown, infer I> ? I
   : T extends Record<string, any> ? SerializedModel<T>
   : never

export function serialize<M>(model: M, depth = 0): Serialized<M> {
   if (depth > 20) throw new Error('Recursive Serialization')

   if (model === null || model === undefined) return null as unknown as Serialized<M>
   if (Array.isArray(model)) return model.map(m => serialize(m, depth + 1)) as Serialized<M>

   if (model instanceof Date) return model.toISOString() as Serialized<M>
   if (model instanceof DateTime) return model.toISO() as Serialized<M>

   if (typeof model === 'object') {
      const entries = Object.entries(model instanceof Document ? model.toObject({ virtuals: true }) : model)
      const props = entries
         .filter(([, v]) => v !== undefined && v !== null)
         .reduce((o, [key, value]) => ({ ...o, [key]: serialize(value, depth + 1) }), {})
      return props as Serialized<M>
   }

   return model as Serialized<M>
}

export default database

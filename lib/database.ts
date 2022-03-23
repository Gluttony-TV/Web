import { NotFoundError } from 'apollo/errors'
import mongoose, { ConnectOptions, Document, Model, Schema } from 'mongoose'
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

export function register<M>(name: string, schema: Schema<Document & M>): Model<M> {
   schema.set('toJSON', { virtuals: true })
   schema.statics.findOrFail = async function (...args: Parameters<typeof this.findOne>) {
      const match = await this.findOne(...args)
      if (match) return match
      throw new NotFoundError(`${name} not found`)
   }
   return mongoose.model<M>(name, schema)
}

export function define<M>(name: string, schema: Schema<Document & M>): Model<M> {
   return mongoose.models[name] ?? register(name, schema)
}

export default database

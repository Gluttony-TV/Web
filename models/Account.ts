import { Schema, Types } from 'mongoose'
import { define } from '../lib/database'

export interface IAccount {
   _id: string
   provider: string
   type?: string
   providerAccountId?: string
   access_token: string
   expires_at: number
   refresh_token?: string
   refresh_token_expires_in?: number
   token_type?: string
   id_token?: string
   scope?: string
   userId?: string
   name?: string
   email?: string
}

const schema = new Schema({
   userId: {
      type: Types.ObjectId,
      required: true,
   },
   provider: {
      type: String,
      required: true,
   },
   type: String,
   name: String,
   email: String,
   providerAccountId: String,
   access_token: {
      type: String,
      required: true,
   },
   expires_at: {
      type: Number,
      required: true,
   },
   refresh_token: String,
   refresh_token_expires_in: Number,
   token_type: String,
   id_token: String,
   scope: String,
})

export default define<IAccount>('Account', schema)

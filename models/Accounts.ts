import { Account } from 'generated/graphql'
import { define } from 'lib/database'
import { Schema, Types } from 'mongoose'

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

export default define<Account>('Account', schema)

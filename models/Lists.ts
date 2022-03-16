import { List } from 'generated/graphql'
import { define } from 'lib/database'
import { Schema, Types } from 'mongoose'
import slugify from 'slugify'

const schema = new Schema({
   userId: {
      type: Types.ObjectId,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   slug: String,
   public: {
      type: Boolean,
      default: true,
   },
   primary: {
      type: Boolean,
      default: false,
   },
   shows: {
      type: [
         {
            id: Number,
            addedAt: Date,
         },
      ],
   },
})

schema.index({ user: 1, name: -1 }, { unique: true })

schema.pre('save', async function (this: List) {
   if (this.name) this.slug = slugify(this.name, { lower: true })
   else this.name = this.slug
})

export default define<List>('List', schema)

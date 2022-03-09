import { Schema, Types } from 'mongoose'
import slugify from 'slugify'
import { define } from '../lib/database'

export interface IList {
   user: string
   name: string
   slug: string
   public: boolean
   shows: Array<{
      id: number
      addedAt: string
   }>
}

const schema = new Schema({
   user: {
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

schema.pre('save', async function (this: IList) {
   if (this.name) this.slug = slugify(this.name, { lower: true })
   else this.name = this.slug
})

export default define<IList>('List', schema)

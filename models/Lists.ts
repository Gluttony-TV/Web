import { define } from 'lib/database'
import { Schema, Types } from 'mongoose'
import slugify from 'slugify'

interface IList {
   id: string
   userId: string
   name: string
   slug: string
   public: boolean
   showIds: Array<{
      id: number
      addedAt: string
   }>
}

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
   showsIds: {
      type: [
         {
            id: Number,
            addedAt: Date,
         },
      ],
   },
})

schema.set('toJSON', { virtuals: true })

schema.index({ user: 1, name: -1 }, { unique: true })

schema.pre('save', async function (this: IList) {
   if (this.name) this.slug = slugify(this.name, { lower: true })
   else this.name = this.slug
})

export default define<IList>('List', schema)

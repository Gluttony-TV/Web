import { define } from 'database'
import { List } from 'graphql/generated/models'
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

schema.index({ userId: 1, name: -1 }, { unique: true })

schema.pre('save', function (this: List) {
   schema.emit('seeded', this)
})

schema.on('seeded', (list: List) => {
   if (list.name) list.slug = slugify(list.name, { lower: true })
   else list.name = list.slug
})

export default define<List>('List', schema)

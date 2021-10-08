import { Schema } from "mongoose";
import { define } from "../lib/database";
import { IProgress } from "../models";

const schema = new Schema({
   user: {
      type: String,
      required: true,
   },
   show: {
      type: Number,
      required: true,
   },
   watched: {
      type: [Number]
   },
})

schema.index({ user: 1, show: -1 }, { unique: true })

/*
schema.pre('save', async function (this: IProgress) {
   this.slug = slugify(this.name, { lower: true })
})
*/

export default define<IProgress>('Progress', schema)
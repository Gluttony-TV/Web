import { Schema, Types } from 'mongoose'
import { getShow } from '../lib/api'
import { define, serialize } from '../lib/database'
import { exists } from '../lib/util'
import { IEpisode } from './Episode'
import { IShow } from './Show'

export interface IProgress<S = IShow['id']> {
   id: string
   user: string
   show: S
   watched: IEpisode['id'][]
}


const schema = new Schema({
   user: {
      type: Types.ObjectId,
      required: true,
   },
   show: {
      type: Number,
      required: true,
   },
   watched: {
      type: [Number],
   },
})

schema.set('toJSON', { virtuals: true })

schema.index({ user: 1, show: -1 }, { unique: true })

export async function withShow(progress: IProgress): Promise<IProgress<IShow> | undefined> {
   const show = await getShow(progress.show)
   return show && { ...serialize(progress), show }
}

export async function withShows(progresses: IProgress[]) {
   const mapped = await Promise.all(progresses.map(withShow))
   return mapped.filter(exists)
}

export default define<IProgress>('Progress', schema)

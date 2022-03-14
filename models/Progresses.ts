import { getShow } from 'lib/api'
import { define, serialize } from 'lib/database'
import { exists } from 'lib/util'
import { Schema, Types } from 'mongoose'
import { IEpisode } from './Episodes'
import { IShow } from './Shows'

interface IProgress {
   id: string
   userId: string
   showId: IShow['id']
   show?: IShow
   watched: IEpisode['id'][]
}

const schema = new Schema({
   userId: {
      type: Types.ObjectId,
      required: true,
   },
   showId: {
      type: Number,
      required: true,
   },
   watched: {
      type: [Number],
   },
})

schema.set('toJSON', { virtuals: true })

schema.index({ user: 1, show: -1 }, { unique: true })

export async function withShow(progress: IProgress): Promise<IProgress | undefined> {
   const show = await getShow(progress.showId)
   return show && { ...serialize(progress), show }
}

export async function withShows(progresses: IProgress[]) {
   const mapped = await Promise.all(progresses.map(withShow))
   return mapped.filter(exists)
}

export default define<IProgress>('Progress', schema)

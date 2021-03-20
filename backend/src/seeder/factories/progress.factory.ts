import { define } from 'typeorm-seeding'
import { Faked } from '..'
import { Show } from '../../api'
import Progress from '../../models/Progress'
import User from '../../models/User'
import { exists } from '../../util'

define(Progress, (faker, ctx?: { user?: User; show?: Show }) => {
   const progress: Faked<Progress> = new Progress()

   if (!ctx?.user) throw new Error('No user provided')
   if (!ctx?.show) throw new Error('No show provided')

   const episodes = ctx.show.seasons
      .map(s => s.episodes)
      .filter(exists)
      .reduce((a, episodes) => [...a, ...episodes], [])

   const now = new Date()
   const created = faker.date.between(ctx.user.timestamps.created, now)

   progress.timestamps = { created, updated: created }
   progress.show = ctx.show.id
   progress.user = ctx.user
   progress.watched = new Array(faker.random.number(episodes.length)).fill(null).map((_, i) => episodes[i].id)

   return progress
})

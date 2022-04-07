import Progress from 'database/models/Progresses'
import { getEpisodes, getTrendingShows } from 'lib/api'
import { createFactory } from '..'

createFactory(Progress, async (faker, ctx) => {
   const shows = await getTrendingShows()
   const showId = ctx.showId ?? faker.random.arrayElement(shows).id
   const episodes = await getEpisodes(showId)
   const watched = episodes.slice(0, faker.datatype.number({ min: 1, max: episodes.length })).map(e => e.id)
   return { showId, watched }
})

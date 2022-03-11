import { createFactory } from '..'
import { getEpisodes, getTrendingShows } from '../../lib/api'
import Progress from '../../models/Progress'

async function getShows() {
   const shows = await getTrendingShows()
   return Promise.all(shows.map(async show => ({ show, episodes: await getEpisodes(show.id) })))
}

createFactory(Progress, async faker => {
   const shows = await getShows()
   const { show, episodes } = faker.random.arrayElement(shows)
   const watched = episodes.slice(0, faker.datatype.number({ min: 1, max: episodes.length })).map(e => e.id)
   return { show: show.id, watched }
})

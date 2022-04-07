import Lists from 'database/models/Lists'
import { getTrendingShows } from 'lib/api'
import { createFactory } from '..'

createFactory(Lists, async faker => {
   const trending = await getTrendingShows()

   const shows = faker.random.arrayElements(trending).map(show => ({
      id: show.id,
      addedAt: faker.date.past(1).getTime(),
   }))

   return { shows }
})

import { Factory, Seeder } from 'typeorm-seeding'
import api from '../../api'
import User from '../../models/User'
import { exists } from '../../util'

async function all<T>(values: Promise<T>[]): Promise<T[]> {
   return (await Promise.all(values.map(v => v.catch(() => null)))).filter(exists)
}

export default class UserSeeder implements Seeder {
   public async run(factory: Factory) {
      await api.login()

      const shows = (await api.getShows()) ?? []

      // Fetch extended shows
      const withSeasons = await all(shows.map(({ id }) => api.getShow(id)))

      // Fetch seasons with episodes
      const withEpisodes = await all(
         withSeasons.filter(exists).map(async show => ({
            ...show,
            seasons: await all(show.seasons.map(({ id }) => api.getSeason(id))),
         }))
      )

      if (withEpisodes.length === 0) throw new Error('Unable to fetch any shows from the API')

      await factory(User)({ tokens: true, shows: withEpisodes.filter(exists) }).createMany(1)
   }
}

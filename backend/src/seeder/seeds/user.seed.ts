import { Factory, Seeder } from 'typeorm-seeding'
import api from '../../api'
import User from '../../models/User'
import { exists } from '../../util'

export default class UserSeeder implements Seeder {
   public async run(factory: Factory) {
      await api.login()

      const shows = (await api.getShows()) ?? []

      // Fetch extended shows
      const withSeasons = await Promise.all(shows.map(({ id }) => api.getShow(id)))

      // Fetch seasons with episodes
      const withEpisodes = await Promise.all(
         withSeasons
            .filter(exists)
            .map(async show => ({
               ...show,
               seasons: await Promise.all(show.seasons.map(({ id }) => api.getSeason(id))),
            }))
            .map(p => p.catch(() => null))
      )

      await factory(User)({ tokens: true, shows: withEpisodes.filter(exists) }).createMany(120)
   }
}

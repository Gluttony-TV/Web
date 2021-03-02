require('dotenv').config({ path: './.env' });

const ts = __filename.endsWith('.ts');
const files = (folder: string) => [ts ? `src/${folder}/**/*.ts` : `build/src/${folder}/**/*.js`]

module.exports = {
   type: process.env.DB_DIALECT,
   database: process.env.DB_STORAGE || process.env.DB_NAME,
   synchronize: true,
   logging: process.env.DB_LOGGING === 'true',
   entities: files('models'),
   migrations: files('migration'),
   subscribers: files('subscriber'),
   seeds: files('seeds'),
   factories: files('factories'),
   cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
   }
};
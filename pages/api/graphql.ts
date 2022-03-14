import { ApolloServer } from 'apollo-server-micro'
import { schema } from 'apollo/schema'
import database from 'lib/database'
import microCors from 'micro-cors'

const apolloServer = new ApolloServer({ schema, introspection: true })

export const config = {
   api: {
      bodyParser: false,
   },
}

const startServer = apolloServer.start()

const cors = microCors()

const apiHandler = cors(async (req, res) => {
   await startServer
   await database()
   const handler = apolloServer.createHandler({ path: '/api/graphql' })
   return handler(req, res)
})

export default apiHandler

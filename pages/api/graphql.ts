import { ApolloServer } from 'apollo-server-micro'
import database from 'database'
import { schema } from 'graphql/apollo/schema'
import { context } from 'graphql/apollo/server'
import microCors from 'micro-cors'

const apolloServer = new ApolloServer({ schema, introspection: true, context })

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

import { ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import { schema } from 'apollo/schema'
import { Maybe, User } from 'generated/graphql'
import database from 'lib/database'
import microCors from 'micro-cors'
import { IncomingRequest } from 'next-auth'

export interface ApolloContext {
   user: Maybe<User>
}

const context: ContextFunction<{ req: IncomingRequest }, ApolloContext> = async ctx => {
   console.log(ctx.req.cookies)
   return { user: null }
}

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

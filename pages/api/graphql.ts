import { ContextFunction } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import { schema } from 'apollo/schema'
import { Maybe, User } from 'generated/graphql'
import { IncomingMessage } from 'http'
import database from 'lib/database'
import microCors from 'micro-cors'
import { getSession } from 'next-auth/react'

export interface ApolloContext {
   user: Maybe<User>
}

const context: ContextFunction<{ req: IncomingMessage }, ApolloContext> = async ({ req }) => {
   const session = await getSession({ req })
   return { user: session?.user ?? null }
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

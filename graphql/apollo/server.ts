import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { ContextFunction } from 'apollo-server-core'
import database from 'database'
import { Maybe } from 'graphql/generated/models'
import { EmptyObject } from 'lib/util'
import { Session } from 'next-auth'
import { getSession, GetSessionParams } from 'next-auth/react'
import { GetServerSidePropsResult } from 'next/types'
import createCache from './cache'
import { NotFoundError } from './errors'
import { schema } from './schema'

export interface ApolloContext {
   user: Maybe<Session['user']>
}

type Props<T> = (T extends void ? EmptyObject : T) & {
   initialApolloState: NormalizedCacheObject
}

export async function prefetchQueries<P>(
   ctx: GetSessionParams,
   consumer: (client: ApolloClient<unknown>) => Promise<P>
): Promise<GetServerSidePropsResult<Props<P>>> {
   await database()
   const client = await createApolloClient(ctx)
   try {
      const extraProps = await consumer(client)
      const props = { ...(extraProps ?? {}), initialApolloState: client.cache.extract() } as Props<P>
      return { props }
   } catch (e) {
      if (e instanceof NotFoundError) {
         return { notFound: true }
      } else {
         throw e
      }
   }
}

export const context: ContextFunction<GetSessionParams, ApolloContext> = async ({ req }) => {
   const session = await getSession({ req })
   return { user: session?.user ?? null }
}

async function createApolloClient(ctx: GetSessionParams) {
   const link = new SchemaLink({ schema, context: context(ctx) })
   return new ApolloClient({
      ssrMode: true,
      link,
      cache: createCache(),
   })
}

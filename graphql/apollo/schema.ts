import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers, typeDefs } from 'graphql/generated/modules'

export const schema = makeExecutableSchema({ typeDefs, resolvers })

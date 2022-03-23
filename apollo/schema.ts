import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers, typeDefs } from 'generated/modules'

export const schema = makeExecutableSchema({ typeDefs, resolvers })

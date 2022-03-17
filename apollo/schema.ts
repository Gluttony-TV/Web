import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers as commonResolvers } from './modules/common/resolvers'
import { resolvers as listResolvers } from './modules/list/resolvers'
import { resolvers as progressResolvers } from './modules/progress/resolvers'
import { resolvers as showResolvers } from './modules/show/resolvers'
import { resolvers as userResolvers } from './modules/user/resolvers'

const types = loadFilesSync('apollo/modules/**/*.gql')
const typeDefs = mergeTypeDefs(types)

//const resolversArray = loadFilesSync('apollo/modules/**/resolvers.ts')
const resolversArray = [commonResolvers, progressResolvers, userResolvers, showResolvers, listResolvers]
const resolvers = mergeResolvers(resolversArray)

export const schema = makeExecutableSchema({ typeDefs, resolvers })

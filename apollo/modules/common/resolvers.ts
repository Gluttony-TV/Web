import { Resolvers } from 'generated/graphql'
import { GraphQLScalarType, Kind } from 'graphql'

const dateScalar = new GraphQLScalarType<Date, number>({
   name: 'Date',
   description: 'Timestamp/Date',
   serialize(value) {
      return (value as Date).getTime()
   },
   parseValue(value) {
      return new Date(value as number)
   },
   parseLiteral(ast) {
      if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10))
      throw new Error('Invalid Date literal')
   },
})

const apiIDScalar = new GraphQLScalarType<number>({
   name: 'ApiID',
   description: 'IDs of TheTVDB models',
   serialize: v => v as number,
   parseValue: v => v as number,
   parseLiteral(ast) {
      if (ast.kind === Kind.INT) return parseInt(ast.value, 10)
      throw new Error('Invalid Date literal')
   },
})

export const resolvers: Resolvers = {
   Date: dateScalar,
   ApiID: apiIDScalar,
}

import { GraphQLScalarType, Kind } from 'graphql'
import { Resolvers } from 'graphql/generated/server'

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
      throw new Error('Invalid API ID literal')
   },
})

const cursorScalar = new GraphQLScalarType<string>({
   name: 'Cursor',
   description: 'Pagination Cursor',
   //serialize: v => Buffer.from(v as string).toString('base64'),
   //parseValue: v => Buffer.from(v as string, 'base64').toString('ascii'),
   serialize: v => v as string,
   parseValue: v => v as string,
   parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return ast.value as string
      throw new Error('Invalid Cursor literal')
   },
})

export const resolvers: Resolvers = {
   Date: dateScalar,
   ApiID: apiIDScalar,
   Cursor: cursorScalar,
}

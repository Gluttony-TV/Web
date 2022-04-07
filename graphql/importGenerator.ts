import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import glob from 'glob'
import { flatMap } from 'lodash'
import { basename, dirname, join } from 'path'
import prettier from 'prettier'

const withoutExtension = (it: string) => it.substring(0, it.lastIndexOf('.'))

const schemas = glob.sync('graphql/modules/**/*.gql')
const resolvers = glob.sync('graphql/modules/**/resolvers.ts').map(withoutExtension)

const dir = join('graphql', 'generated')
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
const out = join(dir, 'modules.ts')

const schemaName = (it: string) => {
   const fileName = basename(it)
   return fileName.substring(0, fileName.indexOf('.')) + 'Schema'
}

const resolversName = (it: string) => basename(dirname(it)) + 'Resolvers'

const content = [
   ["import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'", "import gql from 'graphql-tag'"],
   resolvers.map(it => `import { resolvers as ${resolversName(it)} } from '${it}'`),
   //schemas.map(it => `import ${schemaName(it)} from '${it}'`),
   schemas.map(it => `const ${schemaName(it)} = gql\`${readFileSync(it)}\``),
   [
      `export const typeDefs = mergeTypeDefs([${schemas.map(schemaName).join(', ')}])`,
      `export const resolvers = mergeResolvers([${resolvers.map(resolversName).join(', ')}])`,
   ],
]

const joined = flatMap(content, it => [...it, '']).join('\n')

prettier.resolveConfig('.prettierrc').then(options => {
   writeFileSync(out, prettier.format(joined, options ?? undefined))
})

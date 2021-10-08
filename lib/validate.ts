import Joi, { ValidationOptions } from 'joi'
import { NextApiRequest } from 'next'
import { ApiError } from 'next/dist/server/api-utils'

type Schema = Record<string, Joi.Schema>

type SchemaKey = 'body' | 'headers' | 'query'

type RequestSchema = {
   [K in SchemaKey]?: Schema
}

export default function validate(req: NextApiRequest, schema: RequestSchema, additionalOptions?: ValidationOptions) {
   const options: ValidationOptions = {
      stripUnknown: true,
      ...additionalOptions,
   }

   const predicates = Object.entries(schema)
      .map(([key, blueprint]) => ({ schema: Joi.object(blueprint), key: key as keyof NextApiRequest }))
      .map(({ key, schema }) => (req: NextApiRequest) => schema.validate(req[key], options))

   const results = predicates.map(p => p(req))
   const error = results.map(r => r.error).find(e => !!e)

   if (error) {
      throw new ApiError(400, error.message)
   } else {
      Object.keys(schema)
         .map(k => k as SchemaKey)
         .forEach((key, i) => {
            req[key] = results[i].value
         })
   }
}

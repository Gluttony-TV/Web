import { ValidationOptions } from 'joi'
import { NextApiRequest } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import Joi, { SchemaMap } from 'types-joi'

export default function validate<Body, Query>(
   req: NextApiRequest,
   schema: { body?: SchemaMap<Body>; query?: SchemaMap<Query> },
   additionalOptions?: ValidationOptions
) {
   const options: ValidationOptions = {
      stripUnknown: true,
      ...additionalOptions,
   }

   const results = Object.entries(schema).map(([key, blueprint]) => {
      const schema = Joi.object(blueprint as SchemaMap<unknown>)
      return schema.validate(req[key as keyof NextApiRequest], options)
   })

   const error = results.map(r => r.error).find(e => !!e)

   if (error) {
      throw new ApiError(400, error.message)
   } else {
      Object.keys(schema)
         .map(k => k as keyof typeof schema)
         .forEach((key, i) => (req[key] = results[i].value))

      return req as unknown as { body: Body; query: Query }
   }
}

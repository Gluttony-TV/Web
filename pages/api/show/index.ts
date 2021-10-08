import Joi from "joi";
import { searchShow } from "../../../lib/api";
import validate from "../../../lib/validate";
import { forMethod } from "../../../lib/wrapper";

export default forMethod('get', async (req, res) => {

   await validate(req, {
      query: {
         search: Joi.string().required(),
         limit: Joi.number(),
      }
   })

   const search = req.query.search as string
   const limit = Number.parseInt(req.query.limit as string)

   if (search) {
      res.json(await searchShow(search, limit))
   } else {
      res.json([])
   }

})
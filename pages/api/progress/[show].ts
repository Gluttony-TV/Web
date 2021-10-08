import Joi from "joi";
import validate from "../../../lib/validate";
import withSession, { methodSwitch } from "../../../lib/wrapper";
import Progress from "../../../models/Progress";

const get = withSession(async (_, res, session) => {

   const progress = await Progress.findOne({ user: session?.user.email })
   res.json(progress)

})

const put = withSession(async (req, res, session) => {

   validate(req, {
      query: {
         show: Joi.string(),
      },
      body: {
         watched: Joi.array().items(Joi.number())
      },
   })

   const show = Number.parseInt(req.query.show as string)
   await Progress.updateOne({ user: session.user.email, show }, req.body, { upsert: true })

   res.status(204).send(null)

})

export default methodSwitch({ get, put })
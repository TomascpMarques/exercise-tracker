import express from 'express'
export const exerciseAPIRouter = express.Router()

exerciseAPIRouter.use(
   (req: express.Request, _res: express.Response, next: any) => {
      console.log(`${req.method} @ ${req.path} by ${req.ip}`)
      next()
   }
)

exerciseAPIRouter.route('*').get((req, res) => {
   res.status(200).json({
      sender: req.ip,
      message: 'All good',
   })
})

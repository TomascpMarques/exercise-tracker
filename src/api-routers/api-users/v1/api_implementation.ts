import express from 'express'
// Api router defenition
export const usersApi = express.Router()

// All routes pass through here, this logs the method, path and ip
// given by the req parameter
usersApi.use((req: express.Request, _res: express.Response, next: any) => {
   console.log(`${req.method} @ ${req.path} by ${req.ip}`)
   next()
})

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
usersApi.route('/').get((_req, res) => {
   res.status(200).json({
      error: 'none',
      message: 'Hello ther',
   })
})

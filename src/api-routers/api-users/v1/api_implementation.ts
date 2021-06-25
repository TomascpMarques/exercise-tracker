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
 * /api/v1/users/:
 *  get:
 *    tags:
 *      - users
 *    summary: List all registerd users
 *    description: User operations
 *    responses:
 *      200:
 *        description: Returns a greeting object.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"error": 'none', "message": 'hello there'}
 *              properties:
 *              error:
 *                type: string
 *                description: Op error if any
 *              message:
 *                type: string
 *                description: Server greeting
 */
usersApi.route('/').get((_req, res) => {
  res.status(200).json({
    error: 'none',
    message: 'Hello ther',
  })
})

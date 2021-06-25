import express from 'express'
import { IUser, UserModel } from '../../../mongoose-db/schemas'
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
 *        description: Returns all the saved users in the data-base.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              example:
 *                [{"name": 'John Doe', "age": 18, "country": "Spain"}]
 */
usersApi.route('/').get(async (_req, res) => {
  // Get all users from DB
  const users: IUser[] = await UserModel.find().exec()
  res.status(200).json(users)
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *  get:
 *    tags:
 *      - users
 *    summary: Return user by specified ID
 *    description: Search the database for the user in the route parameter
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: MongoDB ID of the User
 *    responses:
 *      200:
 *        description: Returns the users data from the DB
 *      404:
 *        description: Returns a json object with a not found error
 */
usersApi.route('/:id').get(async (req, res) => {
  const userID = req.params.id
  await UserModel.findById(userID, (err: any, user: IUser) => {
    // If user is not fiund, return an error and an empty object
    if (err)
      res.status(404).json({
        error: err,
        user: {},
      })

    // If user found, return no erros and user
    res.status(200).json({
      error: err,
      user: user,
    })
  })
})

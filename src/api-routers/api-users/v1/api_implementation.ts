import express from 'express'
import { UserModel } from '../../../mongoose-db/schemas'
import { createCheckers } from 'ts-interface-checker'
import schemaInterface from '../../../interfaces/schema-interfaces-ti'
import { IUser } from '../../../mongoose-db/schema-interfaces'

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
 * /api/v1/users/user/{id}:
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
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/FoundUser"
 *      404:
 *        description: Returns the users data from the DB
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserNotFound"
 */
usersApi.route('/user/:id').get(async (req, res) => {
  // get the users ID from the request route, like it more this way
  const userID = req.params.id
  // async get user by mongoDB id, not a taylor-made one
  await UserModel.findById(userID, (err: any, user: IUser) => {
    // If user is not fiund, return an error and an empty object
    if (err)
      res.status(404).json({
        error: err.message,
        user: {},
      })

    // If user found, return no erros and user
    res.status(200).json({
      error: err,
      user: user,
    })
  })
})

/**
 * @swagger
 * /api/v1/users/query?name=name:&age=number:
 *  get:
 *   tags:
 *    - users
 *   summary: Returns a custom list of users
 *   description: The list of users that match the route query params
 *   parameters :
 *    - in: query
 *      $ref: "#/components/parameters/userAgeParam"
 *    - in: query
 *      $ref: "#/components/parameters/usersNameParam"
 *   responses:
 *     200:
 *      description: Returns a list of compatible users
 *     400:
 *      description: Returns an error message
 *     404:
 *      description: Returns a message saying no users were found
 */
usersApi.route('/query').get((req, res) => {
  if (!Object.keys(req.query).length) {
    // Guards against no query values
    return res.status(400).json({ error: 'Must have at least one param' })
  }

  // Gets the vlidator/interface for the expected values
  const { IUserUrlQuerys } = createCheckers(schemaInterface)
  try {
    // Verefies if it has all the necessery values
    IUserUrlQuerys.strictCheck(req.query)
  } catch (err) {
    // If the values are in some way "unexpected", cathces the err here
    console.log('invalid parameters')
    return res.status(400).json({ error: 'Invalid query parameters' })
  }

  // If all is good
  return res.status(200).json(req.query)
})

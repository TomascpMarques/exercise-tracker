/**
 * Check the end of the file for info/notes
 */

import express from 'express'
import { UserModel } from '../../../mongoose-db/schemas'
import { createCheckers } from 'ts-interface-checker'
import schemaInterfaceTi from '../../../interfaces/schema-interfaces-ti'
import { IUser } from '../../../mongoose-db/schema-interfaces'
import { Error } from 'mongoose'

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
 * /api/v1/users/findByID/{id}:
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
usersApi.route('/findByID/:id').get(async (req, res) => {
  // get the users ID from the request route, like it more this way
  const userID = req.params.id
  // async get user by mongoDB id, not a taylor-made one
  await UserModel.findById(userID, (err: Error, user: IUser) => {
    // If user is not fiund, return an error and an empty object
    if (err)
      return res.status(404).json({
        error: err.message,
        user: {},
      })

    // If user found, return no erros and user
    return res.status(200).json({
      error: err,
      user: user,
    })
  })
})

/**
 * @swagger
 * /api/v1/users/findByName?:
 *  get:
 *    tags:
 *      - users
 *    summary: Returns a list of users based on the given name
 *    description: Takes the first and last name from the req.query,
 *                 creates a regex for both ('\S+', matches all none spaces),
 *                 then compares the regex to the names, first and last fields
 *                 then returns the regex matched values
 *    parameters:
 *      - in: query
 *        $ref: '#/components/parameters/usersFirstNameParam'
 *      - in: query
 *        $ref: '#/components/parameters/usersLastNameParam'
 *    responses:
 *      200:
 *        description: Return the query matched users
 *      400:
 *        description: Returns no users, and a bad param message
 *      404:
 *        description: Returns no errors, and no found users
 */
usersApi.route('/findByName').get(async (req, res) => {
  // Checks for empyt query, returns if so
  if (!Object.keys(req.query).length) {
    return res.status(400).json({
      error: 'No empty querys',
    })
  }

  // Check the validaty of the req.query values,
  // Against the expected values, described in a interface
  const { IFindByNameURLQuery } = createCheckers(schemaInterfaceTi)
  try {
    IFindByNameURLQuery.strictCheck(req.query)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Bad parameters' })
  }

  // This neat little trick, uses regex to get the results
  // that are most similar to the requested one,
  // even with incomplete data, i.e. just first or last name
  // even when thei are incomplete, i.e name = 'aaaa',
  // and the given name was 'aa'.
  const firstNameRegex = new RegExp(
    `${req.query.first?.length ? req.query.first : `\\S+`}`,
    'i'
  )
  const lastNameRegex = new RegExp(
    `${req.query.last ? req.query.last : `\\S+`}`,
    'i'
  )

  // The type sistem in Ts, wont allow to pass the regex in the default object
  // So, the object properties need to be like this do to regex
  return await UserModel.find({
    'name.first': firstNameRegex,
    'name.last': lastNameRegex,
  }).exec((err: Error, users: IUser[]) => {
    // Case for errors in search
    if (err) return res.status(400).json({ error: err.message, results: users })
    // Case for no results in search
    if (users.length < 1)
      return res.status(404).json({ error: 'no found users', results: [] })
    // Case for succesfull search operation
    return res.status(200).json({ error: null, results: users })
  })
})

/**
 * @swagger
 * /api/v1/users/findByCountry?:
 *  get:
 *    tags:
 *      - users
 *    summary: Return list of users based on given country name
 *    description: Returns the users wich the country matches the given one
 *    parameters:
 *      - in: query
 *        name: country
 *        type: string
 *        description: Users country name
 *    responses:
 *      200:
 *        description: Return the query matched users
 *      400:
 *        description: Returns no users, and a bad param message
 *      404:
 *        description: Returns no errors, and no found users
 */
usersApi.route('/findByCountry').get(async (req, res) => {
  // Checks for empyt query, returns if so
  if (!Object.keys(req.query).length) {
    return res.status(400).json({
      error: 'No empty querys',
    })
  }

  // Check the validaty of the req.query values,
  // Against the expected values, described in a interface
  const { IFindByCountryURLQuery } = createCheckers(schemaInterfaceTi)
  try {
    IFindByCountryURLQuery.check(req.query)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Bad parameters' })
  }

  const countryRegex = new RegExp(`^${req.query.country}`, 'i')

  // Finds the users that equal or ar simillar to the users country
  return await UserModel.find({ country: countryRegex }).exec(
    (err: Error, users: IUser[]) => {
      // Error handeling
      if (err)
        return res.status(500).json({
          error: err.message,
        })

      // 404 for no users
      if (users.length < 1)
        return res.status(404).json({ error: null, message: 'No users Found' })

      // All good in the search for users
      return res.status(200).json({
        error: null,
        results: users,
      })
    }
  )
})

/**
 * Notes:
 *  By using regex in the fields instead of a single fix value, allows
 *  the endpoint to be used in "real-time", wich means as the user is typping
 *  the api car return simillar or exact results to what is being sent.
 */

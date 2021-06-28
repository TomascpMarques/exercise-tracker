/**
 * Check the end of the file for info/notes
 */

import express from 'express'
import { UserModel } from '../../../mongoose-db/schemas'
import { createCheckers } from 'ts-interface-checker'
import schemaInterfaceTi from '../../../interfaces/schema-interfaces-ti'
import { IUser } from '../../../mongoose-db/schema-interfaces'
import { Error } from 'mongoose'
import rateLimit from 'express-rate-limit'

// Api router defenition
export const usersApi = express.Router().use(express.json())

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
})

usersApi.use(limiter)

// All routes pass through here, this logs the method, path and ip
// given by the req parameter
usersApi.use((req: express.Request, _res: express.Response, next: any) => {
  console.log(`${req.method} @ ${req.path} by ${req.ip}`)
  next()
})

/**
 * @swagger
 * /api/v1/users/register:
 *  post:
 *    tags:
 *      - users
 *    summary: Registers a user
 *    description: Uses the post request json body to validate the given user
 *                 then, inserts the new user in the database
 *    requestBody:
 *      description: New users content
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Returns a success message with descriptive content
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessfulUserRegister'
 *      400:
 *        description: Returns the erro cause in a message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"error": "error here"}
 *      500:
 *        description: Internal server error, and error message
 */
usersApi.route('/register').post(async (req, res) => {
  // Checks for empyt query, returns if so
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
      error: 'No empty querys',
    })
  }

  // Checks given data for errors, and structure validatiy
  const { IRegisterUserReferenceIUser } = createCheckers(schemaInterfaceTi)
  try {
    // Strict check is very nice,
    // better at preventing errors than .check()
    IRegisterUserReferenceIUser.strictCheck(req.body)
  } catch (err: any) {
    // If there were any errors, means that it was bad data
    // So invalid request status
    return res.status(400).json({ error: err })
  }

  // Get the new users data from the request body
  const newUser: IUser = req.body

  // Mandatory checks for existing users
  if (newUser.usrName.match(/\W+/gm))
    // The usrName cant have no special chars or spaces
    return res.status(400).json({
      error: 'User name must no contain spaces or special characters',
    })

  if (newUser.usrName.length < 4 || newUser.usrName.length > 16)
    return res.status(400).json({
      error: 'User name must be between 4 and 16 characters',
    })

  // Trys to find a user with that userName,
  // If so, no user will be created
  const users = await UserModel.find({ usrName: newUser.usrName }).exec()
  if (users.length >= 1) {
    return res.status(400).json({
      error: 'user already exists',
    })
  }

  // New user document creation and upload to the data.base
  const user = await (await UserModel.create(req.body)).save()
  // Error checking
  if (user.errors)
    return res.status(500).json({
      error: user.errors.message,
      errorName: user.errors.name,
    })

  // If all succedes, the return no errors, and the new users ID
  return res.status(200).json({ error: null, userId: user.id })
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
  await UserModel.find().exec((err: Error, users: IUser[]) => {
    // Internal server error in search
    if (err)
      return res.status(500).json({
        error: err.message,
      })

    // No users in the DB
    if (users.length < 1)
      return res.status(404).json({
        message: 'No users in Registry',
        result: users,
      })

    // All good in the serach
    return res.status(200).json({
      error: err,
      result: users.sort(),
    })
  })
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
  // Checks for empyt query, returns if so
  if (!Object.keys(req.query).length) {
    return res.status(400).json({
      error: 'No empty querys',
    })
  }
  // get the users ID from the request route, like it more this way
  const userID = req.params.id
  // async get user by mongoDB id, not a taylor-made one
  return await UserModel.findById(userID, (err: Error, user: IUser) => {
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
    return res.status(200).json({ error: null, results: users.sort() })
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
 * @swagger
 * /api/v1/users/findByUsrName/{usrName}:
 *  get:
 *    tags:
 *      - users
 *    summary: Returns users with the specific or most similar user name
 *    description: Finds the user by the given usrName, but aslo allows for live
 *                 search, meaning, it can return users with a similar usr name
 *                 or equal usrName while typing. Allows partial usrNames, there
 *                 for the regex used for name searching is case insenssitive.
 *                 Avoid using if you need an exact match.
 *    parameters:
 *      - in: path
 *        name: usrName
 *        type: string
 *        description: The wantted users name
 *    responses:
 *      200:
 *        description: Returns a list or a single profile of the wantted user
 *      404:
 *        description: Returns no users, and a "no users found" message
 *      400:
 *        description: Returns a error of bad parameters and no users
 *      500:
 *        description: Internal server error
 */
usersApi.route('/findByUsrName/:usrName').get(async (req, res) => {
  // Verifies is the necessary param exists
  if (!req.params.usrName) {
    res.status(400).json({
      error: 'No empty parameters',
    })
  }

  // Allows the search to return simmilar values
  const userName = new RegExp(`^${req.params.usrName}`, 'i')

  // Starts the search for the useer
  await UserModel.find({ usrName: userName }).exec(
    (err: Error, users: IUser[]) => {
      // Internal server error handeling
      if (err)
        return res.status(500).json({
          error: err.message,
        })

      // No found users
      if (users.length < 1)
        return res.status(404).json({
          error: 'No users found for given (or similar) name',
          results: users,
        })

      // Found users
      return res.status(200).json({
        error: null,
        results: users.sort(),
      })
    }
  )
})

/**
 * @swagger
 * /api/v1/users/findByAge/{age}:
 *  get:
 *   tags:
 *    - users
 *   summary: Returns a list of users based on the given age
 *   parameters:
 *    - in: path
 *      name: age
 *      type: string
 *      description: Users age
 *   responses:
 *    200:
 *      description: Returns a list or a single profile of users
 *    404:
 *      description: Returns no users, and a "no users found" message
 *    400:
 *      description: Returns a error of bad parameters and no users
 *    500:
 *      description: Internal server error
 */
usersApi.route('/findByAge/:age').get(async (req, res) => {
  // Parameter validation
  if (!req.params.age)
    return res.status(400).json({
      error: 'No empty parameters',
    })

  // Check the age param for malformed data
  // only accept digits, nothing else
  if (req.params.age.match(/\D+/gm))
    return res.status(400).json({
      error: 'The age should only contain numbers',
    })

  // Age conversion from number to string
  const targetAge = Number(req.params.age)

  return await UserModel.find({ age: targetAge }).exec(
    (err: Error, users: IUser[]) => {
      if (err)
        return res.status(500).json({
          error: err.message,
        })

      if (users.length < 1)
        return res.status(404).json({
          error: 'No users found for given age',
          results: {},
        })

      return res.status(200).json({
        error: null,
        results: users,
      })
    }
  )
})

/**
 * @swagger
 * /api/v1/users/findByExercise/{exercise}:
 *  get:
 *   tags:
 *    - users
 *   summary: Returns a list of users with simmilar or equal(text equalitty) exercises
 *   responses:
 *    200:
 *      description: Returns a list or a single profile of users
 *    404:
 *      description: Returns no users, and a "no users found" message
 *    400:
 *      description: Returns a error of bad parameters and no users
 *    500:
 *      description: Internal server error
 */
usersApi.route('/findByExercise/:exercise').get(async (req, res) => {
  // Verify if the needed params exist
  if (!req.params.exercise)
    return res.status(400).json({
      error: 'No empty parameters',
    })

  // Create regex for inclussive search
  const exerciseRegex = new RegExp(`^${req.params.exercise}`, 'i')

  // Mongoose search in mongoDB
  return await UserModel.find({ favorite_exercise: exerciseRegex }).exec(
    (err: Error, users: IUser[]) => {
      // Internal error handeling
      if (err)
        return res.status(500).json({
          error: err.message,
        })

      // Handle no records found for the given search params
      if (users.length < 1)
        return res.status(404).json({
          error: 'No users found for given exercise',
          results: {},
        })

      // Seuccesful search
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
 *
 *  The use of case insenssitive regex allow for greater freedom in searching for
 *  ceairtan values, for example names
 */

/**
 * This file holds the api routing by version and endpoint
 * instead of creating each api as a router, they are created
 * as another "express app", a sub app more info (https://expressjs.com/en/4x/api.html#app.mountpath).
 *
 * The routing for each specific version and path is defined by the
 * app.use() method, first the api's url/path, then, the express sub-app
 * itself, not a router, a express sub-app
 */

import express from 'express'
import { userAPI, userApiDefenition } from './api-users/v1/api_defenition'

const apiVersioningRouter = express.Router()

// Exercise api routing to route '[/api]/vX/entrypoint'
apiVersioningRouter.use(userApiDefenition.url, userAPI)

export default apiVersioningRouter

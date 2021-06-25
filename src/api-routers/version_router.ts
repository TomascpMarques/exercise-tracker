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

import * as swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions: swaggerJSDoc.Options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Exercise API',
         version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:5000' }],
   },
   apis: ['./src/api-routers/api-users/v1/api_implementation.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

const apiVersioningRouter = express.Router()

// Exercise api routing to route '[/api]/vX/entrypoint'
apiVersioningRouter.use(userApiDefenition.url, userAPI)

// Setup SwaggerUI Docs
apiVersioningRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default apiVersioningRouter

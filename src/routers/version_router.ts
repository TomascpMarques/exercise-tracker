import express from 'express'
import {
   exerciseAPI,
   exerciseApiDefenition,
} from './api-exercise/v1/api_defenition'

const apiVersioningRouter = express.Router()

// Exercise api routing
apiVersioningRouter.use(exerciseApiDefenition.apiPath(), exerciseAPI)

export default apiVersioningRouter

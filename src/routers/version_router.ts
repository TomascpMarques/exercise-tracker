import express from 'express'
import { exerciseAPI, exerciseApiDefenition } from './api_exercise/v1/api_def'

const apiVersioningRouter = express.Router()

// Exercise api routing
apiVersioningRouter.use(exerciseApiDefenition.apiPath(), exerciseAPI)

export default apiVersioningRouter

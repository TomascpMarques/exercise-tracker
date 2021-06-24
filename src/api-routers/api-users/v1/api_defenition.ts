import express from 'express'

import ApiDefenition from '../../api-defenition-struct/api_defenition'
// the router for the API
import { usersApi as apiRouter } from './api_implementation'
// Api meta data
import * as api_data from './api_meta.json'

// making the api available
export const userAPI = express().use(apiRouter)
// making the api defenition available
export const userApiDefenition: ApiDefenition = api_data

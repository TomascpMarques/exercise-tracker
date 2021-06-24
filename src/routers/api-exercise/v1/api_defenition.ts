import express from 'express'

import ApiDefenition from '../../api-defenition-struct/api_defenition'
import { exerciseAPIRouter } from './api_implementation'
import * as api_data from './api_meta.json'

export const exerciseAPI = express().use(exerciseAPIRouter)

export const exerciseApiDefenition: ApiDefenition = api_data

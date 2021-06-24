import express from 'express'
import ApiDefenition from '../../api-defenition-struct/api_defenition'
import { exerciseAPIRouter } from './api_implementation'

export const exerciseAPI = express().use(exerciseAPIRouter)

export const exerciseApiDefenition: ApiDefenition = {
   apiRoot: 'exercise',
   apiVersion: 'v1',
   apiPath: () => {
      return `/${exerciseApiDefenition.apiVersion}/${exerciseApiDefenition.apiRoot}`
   },
}

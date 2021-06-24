import express from 'express'
import ApiDefenition from '../../apis_defs/api_defenition'
import { exerciseAPIRouter } from './api'

export const exerciseAPI = express().use(exerciseAPIRouter)

export const exerciseApiDefenition: ApiDefenition = {
   apiRoot: 'exercise',
   apiVersion: 'v1',
   apiPath: () => {
      return `/${exerciseApiDefenition.apiVersion}/${exerciseApiDefenition.apiRoot}`
   },
}

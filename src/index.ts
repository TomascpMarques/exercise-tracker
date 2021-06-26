require('dotenv').config()

import mongoose from 'mongoose'
import cors from 'cors'
import express from 'express'
import apiVersionRouting from './api-routers/version_router'
import { debug } from 'console'

// sets up the api/s endpoints and the app itself
const app = express().use('/api', apiVersionRouting).use(cors())

// Check for a connection string
if (!process.env.MONGO_URL) throw new Error('No mongo connection string in env')

// DB connect
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('error', (err) => {
  throw new Error(`Error: ${err}`)
})

mongoose.connection.once('open', () => {
  console.log('Connected to DB')
})

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`)
})

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})

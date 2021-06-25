require('dotenv').config()

import mongoose from 'mongoose'
import cors from 'cors'
import express from 'express'
import apiVersionRouting from './api-routers/version_router'

// sets up the api/s endpoints and the app itself
const app = express().use('/api', apiVersionRouting).use(cors())

if (!process.env.MONGO_URL) throw new Error('No mongo connection string in env')

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', (err) => {
  throw new Error(`Error: ${err}`)
})

db.once('open', () => {
  console.log('Connected to DB')
})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`)
})

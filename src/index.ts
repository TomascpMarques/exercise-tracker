require('dotenv').config()

import cors from 'cors'
import express from 'express'
import apiVersionRouting from './api-routers/version_router'

// sets up the api/s endpoints and the app itself
const app = express().use('/api', apiVersionRouting).use(cors())

app.listen(process.env.PORT, () => {
   console.log(`Server is listening on port: ${process.env.PORT}`)
})

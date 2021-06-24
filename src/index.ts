require('dotenv').config()

import express from 'express'
import apiVersionRouting from './routers/version_router'

// sets up the api/s endpoints and the app itself
const app = express().use('/api', apiVersionRouting)

app.listen(process.env.PORT, () => {
   console.log(`Server is listening on port: ${process.env.PORT}`)
})

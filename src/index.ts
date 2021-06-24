require('dotenv').config()

import express from 'express'
import apiVersionRouter from './routers/version_router'

const app = express()

app.use('/api', apiVersionRouter)

app.listen(process.env.PORT, () => {
   console.log(`Server is listening on port: ${process.env.PORT}`)
})

require('dotenv').config()

import express from 'express'

const app = express()

app.get('/', (req, res) => {
   res.send(200).json({
      path: req.path,
      message: 'Hello',
   })
})

app.listen(process.env.PORT, () => {
   console.log(`Server is listening on port: ${process.env.PORT}`)
})

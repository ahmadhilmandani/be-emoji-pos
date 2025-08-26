const express = require('express');
const cors = require('cors')
require('dotenv').config()
const authRoute = require('./src/routes/authRoute');
const { errorHanlder } = require('./src/middleware/errorHanlder');
const { log } = require('./src/middleware/log');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(log)
app.use('/api/auth', authRoute)
app.use('/api/auth', errorHanlder)

app.listen(process.env.PORT || 8000, () => {
  console.log(`running on http://localhost:${process.env.PORT || 8000}`)
})
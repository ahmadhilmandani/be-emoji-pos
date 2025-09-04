const express = require('express');
const cors = require('cors')
require('dotenv').config()
const authRoute = require('./src/routes/authRoute');
const supplierRoute = require('./src/routes/supplierRoute');
const { errorHanlder } = require('./src/middleware/errorHanlder');
const { log } = require('./src/middleware/log');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(log)
app.use('/api/auth', authRoute)
app.use('/api/supplier', supplierRoute)
app.use(errorHanlder)

app.listen(process.env.PORT || 8000, () => {
  console.log(`running on http://localhost:${process.env.PORT || 8000}`)
})
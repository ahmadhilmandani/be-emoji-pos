const express = require('express');
const cors = require('cors')
require('dotenv').config()
const authRoute = require('./src/routes/authRoute');
const supplierRoute = require('./src/routes/supplierRoute');
const productRoute = require('./src/routes/productRoute');
const userInfoRoute = require('./src/routes/userInfoRoute');
const purchaseRoute = require('./src/routes/purchaseRoute');
const ingredientsRoute = require('./src/routes/ingredientsRoute');
const { errorHanlder } = require('./src/middleware/errorHanlder');
const { log } = require('./src/middleware/log');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(log)
app.use('/api/auth', authRoute)
app.use('/api/supplier', supplierRoute)
app.use('/api/product', productRoute)
app.use('/api/user-info', userInfoRoute)
app.use('/api/ingredients', ingredientsRoute)
app.use('/api/purchase', purchaseRoute)

app.use(errorHanlder)

app.listen(process.env.PORT || 8000, () => {
  console.log(`running on http://localhost:${process.env.PORT || 8000}`)
})
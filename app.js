const express = require('express')
require('dotenv').config();
const connectDb = require('./database/db')
const userrouter = require('./routes/userRoutes')
const carrouter = require('./routes/carRoutes')
const orderrouter = require('./routes/orderRoutes')

const app = express()
const port = 5000

connectDb()

app.use(express.json())

app.use("/api/users/", userrouter)
app.use("/api/cars/", carrouter)
app.use("/api/orders/", orderrouter)


app.listen(port, () => {
    console.log(`server is listening at port ${port}`)
})
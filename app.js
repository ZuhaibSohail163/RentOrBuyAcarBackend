const express = require('express')
const connectDb = require('./database/db')
const router = require('./routes/userRoutes')
const app = express()
const port = 5000

connectDb()

app.use(express.json())

app.use("/api/", router)


app.listen(port, () => {
    console.log(`server is listening at port ${port}`)
})
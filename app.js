const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const bodyPaser = require('body-parser')
const userRoute = require('./Routes/userRoute')
const authRoute = require('./Routes/authRoute')
require('dotenv').config()
const port = process.env.PORT || 3003;

app.use(cookieParser());
app.use(cors())
// app.use(express.cookieParser())
// app.use(cookieParser());
app.use(bodyPaser.json())
app.use('/user', userRoute)
app.use('/auth', authRoute)

app.listen(port, console.log("\x1b[33m", `\tExpress is running on Port ${port}... `))

mongoose.connect(
    process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true   
    }, 
    () => console.log("\x1b[35m","\t  & Database is connected...","\x1b[36m") 
);
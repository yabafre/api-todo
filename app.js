const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 3000
const compression = require('compression')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {DB_USER, DB_PASSWORD, DB_NAME} = process.env

app.use(compression())
app.use(cors())
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}?retryWrites=true&w=majority`,

{ useNewUrlParser: true, useUnifiedTopology: true })

mongoose.set('strictQuery', true);
mongoose.set('bufferTimeoutMS', 30000);

const db = mongoose.connection
db.on("error", console.error.bind(console, "ERROR: CANNOT CONNECT TO MONGO-DB"))
db.on("open", () => console.log("CONNECTED TO MONGO-DB"))

const authRouter = require ('./routers/authRouter').router
const userRouter = require ('./routers/userRouter').router

app.use(bodyParser.json())

app.use('/auth', authRouter)
app.use('/', userRouter)

app.listen(port, () => console.log(`Serveur Express lancé sur le port ${port}`))

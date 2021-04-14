const express = require('express')
const reporterRouter = require('./routers/user')
const newsRouter = require('./routers/reporter')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Reporter=require('./models/reports')
const News=require('./models/news')
require('./db/mongoos')

const app = express()
app.use(express.json())

app.use(reporterRouter)
app.use(newsRouter)
const port = 3000
app.listen(port,()=>{
    console.log('Server is running')
})
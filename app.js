// CONNECTION
const { MONGODB_URI, DB_NAME } = require('./utils/config')

const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
.then(res => {
    console.log('connected to mongodb (lesgo)')
})

// APP
const express = require('express')
require('express-async-errors')
const cors = require('cors')

const blogs = require('./controllers/blogs')
const users = require('./controllers/users')
const login = require('./controllers/login')
const { getRequestUser, getRequestToken } = require('./middleware/authMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use(getRequestToken)

app.use('/api/login', login)
app.use('/api/users', users)
app.use('/api/blogs', blogs)

app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use((req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
})

module.exports = app

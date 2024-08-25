
// CONNECTION
const { MONGODB_URI } = require('./utils/config')

const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
.then(res => {
    console.log('connected to mongodb (lesgo)')
})

// APP
const express = require('express')
require('express-async-errors')
const cors = require('cors')

const blogs = require('./controllers/blogs')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogs)

app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use((req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
})

module.exports = app
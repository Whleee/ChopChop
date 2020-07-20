const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const dataRouter = require('./routes/data-router')


const app = express()
const apiPort = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', dataRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
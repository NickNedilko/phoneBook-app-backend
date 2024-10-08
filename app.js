// mongo password ZMblQxIuNHLjmeSA
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const contactsRouter = require('./routes/api/contacts')
const authRouter = require('./routes/api/auth')
const userRouter = require('./routes/api/user')



const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)



app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({message,})
})

module.exports = app

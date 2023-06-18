import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import router from './router.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

dotenv.config()

const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use('/', router)



  const initDB = async () => {
    mongoose.connect("mongodb+srv://beadando:bcKmvxCun6835hw9@web2-beadando.kpt9jyx.mongodb.net/?retryWrites=true&w=majority")
  
    mongoose.connection
      .once('open', () => {
        console.info('Connected to MongoDB')
      })
      .on('error', (error) => {
        console.error('MongoDB connection error: ', error)
      })
  }
  
  initDB()

  app.listen(PORT, () => {
    console.info(`Server listening on localhost:${PORT}`)
  })
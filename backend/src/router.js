import { Router } from "express"
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = Router()

const TOKEN_SECRET = "secret_token"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: { type: String, select: false},
    registeredAt: { type: Date, default: Date.now, select: false}
})

const gameSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    year:{
        type: Date,
        required: true,
    }
})

const Game = mongoose.model('Game', gameSchema)
const User = mongoose.model('User', userSchema)

//login
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
      next('User exists')
    } else {
      const hashed = await bcrypt.hash(password, 10)
      const createdUser = await User.create({ username, password: hashed })
      res.json({ id: createdUser.id })
    }
  })

//register
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')
    if (!user) {
      next('No such user')
    } else {
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        next('Wrong password')
      } else {
        const token = await jwt.sign({ userId: user.id }, TOKEN_SECRET, {
          expiresIn: '1h',
        })
        res.cookie('auth', token, { httpOnly: true })
        res.json({ token })
      }
    }
  })

//get all item

//get specific item

//get filtered item list

//post comment

//modify item

//add item

//delete item

//add to cart

//check cart

//delete from cart

//modify item count in cart

//checkout


export default router
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
        default: Date.now
    }
})

const cartSchema = new mongoose.Schema({
  games:{
    type: [String],
    reqired: true
  },
  userID:{
    type: mongoose.Types.ObjectId,
    reqired: true
  },
  cost:{
    type: Number
  },
  date:{
    type: Date,
    required: true,
    default: Date.now
}
})

const Game = mongoose.model('Game', gameSchema)
const User = mongoose.model('User', userSchema)
const Cart = mongoose.model('Cart', cartSchema)

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
router.get('/items', async(req, res) => {
  const games = await Game.find()
  res.json({game : games})
})

//get specific item
router.get('/item', async(req, res) => {
  const game = await Game.findOne(req.body.name)
  res.json({game : game})
})

//get filtered item list
router.get('/items/:name', async(req, res) => {
  const game = await Game.find({name: new RegExp(req.params.name)})
  res.json({game : game})
})

//modify item
router.put('/modifyItem/:name', async(req, res) => {
  const { newName, newPrice, newDescription }  = req.body
  try {
    if(await Game.findOne({name: newName})){
      res.send("The new name already exists!")
    }else{
      const doc = await Game.findOneAndUpdate({name: req.params.name}, {
        $set:{
          name: newName,
          price: newPrice,
          description: newDescription}
      }, {new: true})
      if(doc){
        res.send(doc)
      }
      else{
        res.send("This game does not exist!")
      }
    }
  }catch(err){
    res.send("An error occured!")
  }
})

//add item
router.post('/addItem', async(req, res) =>{
  const { name, price, description } = req.body
    const user = await Game.findOne({ name })
    if (user) {
      next('Game exists')
    } else {
      const createdGame = await Game.create({ name, price, description})
      res.json({ id: createdGame.id })
    }
})

//delete item
router.delete('/deleteItem', async(req, res) =>{
  const name = req.body.name
    const deleteResult = await Game.deleteOne({ name })
      res.json({ count: deleteResult.deletedCount })
    })


//checkout
router.post('/checkout', async(req, res) => {
  const {games, userID, cost} = req.body
  const id = new mongoose.Types.ObjectId(userID)
  const createdCart = await Cart.create({ games, id, cost})
      res.json({ id: createdCart.id })
})

export default router
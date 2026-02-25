import express from 'express'
import { getFavorites, getUserBookings, updateFavorite } from '../src/controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/bookings', getUserBookings) 
userRouter.post('/update-favorite', updateFavorite) 
userRouter.get('/get-favorite', getFavorites) 


export default userRouter
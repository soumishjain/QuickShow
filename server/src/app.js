import dotenv from 'dotenv/config'
import express from 'express'
import { connectToDb } from './config/database.js'
import { clerkMiddleware } from '@clerk/express'


const app = express()
app.use(express.json())
app.use(clerkMiddleware())


connectToDb()

app.get('/',(req,res) => res.send("Server is Live"))



export default app
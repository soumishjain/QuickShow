import dotenv from 'dotenv/config'
import express from 'express'
import { connectToDb } from './config/database.js'
import {inngest, functions } from './inngest/index.js'
import {serve} from 'inngest/express'


const app = express()
app.use(express.json())
app.use(clerkMiddleware())
app.use('/api/inngest', serve({Client : inngest,functions}))


connectToDb()

app.get('/',(req,res) => res.send("Server is Live"))



export default app
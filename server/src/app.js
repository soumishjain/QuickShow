import dotenv from 'dotenv/config'
import express from 'express'
import { connectToDb } from './config/database.js'
import {inngest, functions } from './inngest/index.js'
import { clerkMiddleware } from '@clerk/express'
import {serve} from 'inngest/express'


const app = express()
app.use(express.json())
app.use(clerkMiddleware())
app.use('/api/inngest', serve({client : inngest,functions}))
console.log("ENV EVENT:", process.env.INGEST_EVENT_KEY);
console.log("ENV SIGNING:", process.env.INGEST_SIGNING_KEY);

connectToDb()

app.get('/',(req,res) => res.send("Server is Live"))



export default app
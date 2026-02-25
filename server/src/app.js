import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectToDb } from './config/database.js'
import {inngest, functions } from './inngest/index.js'
import { clerkMiddleware } from '@clerk/express'
import {serve} from 'inngest/express'
import showRouter from '../routes/show.routes.js'
import bookingRouter from '../routes/booking.routes.js'
import adminRouter from '../routes/admin.routes.js'
import userRouter from '../routes/user.routes.js'
import { stripeWebhooks } from './controllers/stripeWebhooks.js'


const app = express()
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
connectToDb()


app.use('/api/stripe' , express.json(), stripeWebhooks)

app.use(express.json())

app.use('/api/inngest', serve({client : inngest,functions}))
app.use(clerkMiddleware())
app.use('/api/show',showRouter)

app.use('/api/bookings',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)


app.get('/',(req,res) => res.send("Server is Live"))



export default app
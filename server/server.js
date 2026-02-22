import app from './src/app.js'
import { connectToDb } from './src/config/database.js'

const startServer = async () => {
    await connectToDb()

    app.listen(3000 , () => {
        console.log("Server running on http://localhost:3000");
    })
}

startServer()
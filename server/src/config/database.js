import mongoose from "mongoose";

async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            serverSelectionTimeoutMS: 30000
        })
        console.log("Server is connected to Database")
    }catch(error){
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}

export {connectToDb}
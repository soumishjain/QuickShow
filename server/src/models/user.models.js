import { MongoNetworkTimeoutError } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
     name : {
        type : String,
        required : true
    },
     email : {
        type : String,
        required : true
    },
     image_url : {
        type : String,
        required : true
    },
})

const userModel = mongoose.model('user',userSchema)
export default userModel
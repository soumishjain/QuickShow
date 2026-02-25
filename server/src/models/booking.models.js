import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user : {
        type : String,
        required: true,
        ref : 'user'
    },
    movie : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'movie'
    },
    show : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'show'
    },
    bookedSeats : {
        type: [String],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    isPaid : {
        type : Boolean,
        default : false
    },
    paymentLink : {
        type : String,
    }
},{timestamps : true})

const bookingModel = mongoose.model('booking',bookingSchema)

export default bookingModel
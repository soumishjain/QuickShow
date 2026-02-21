import mongoose from 'mongoose'

const showSchema = new mongoose.Schema(
    {
        movie : {type : String, required : true , ref : 'movie'},
        showDateTime : {type: Date,required : true},
        showPrice : {type : Number , required : true},
        occupiedSeats : {type : Object , default : {}}
    } , {minimize : false}
)

const showModel = mongoose.model("show",showSchema)
export default showModel
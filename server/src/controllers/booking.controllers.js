import bookingModel from "../models/booking,models.js";
import showModel from "../models/show.models.js";

export const checkSeatAvailability = async(showId , selectedSeats) => {
    try{
        const showData = await showModel.find({id : showId})
        if(!showData) return false;

        const ouccpiedSeats = showData.occupiedSeats

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken
    } catch(error){
        console.error(error.message)
        return false;
    }
}
export const createBooking = async (req,res) => {
    try{
        const {userId} = req.auth()
        const {showId , selectedSeats} = req.body
        const {origin} = req.headers

        const isAvailable = await checkSeatAvailability(showId , selectedSeats)

        if(!isAvailable){
            return res.json({success : false, message : "Selected Seats are not available"})

        }

        const showData = await showModel.findOne({id : showId}).populate('movie')

        const booking = await bookingModel.create({
            user : userId,
            show : showId,
            amount : showData.showPrice * selectedSeats.length,
            bookedSeats : selectedSeats
        })

        selectedSeats.map(seat => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified('occupiedSeats')

        await showData.save()

        res.json({success : true , message : 'booked Successfully'})

    }catch(err){
        console.log(err.message)
        Response.json({success : false, message : error.messaege})

    }
}

export const getOccupiedSeats = async(req,res) => {
    try{
        const {showId} = req.params
        const showData = await showModel.findOne({id : showId})

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.jaon({success : true, occupiedSeats})
    }catch(error){
        console.log(err.message)
    }
}
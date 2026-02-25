import bookingModel from "../models/booking.models.js";
import showModel from "../models/show.models.js";
import Stripe from 'stripe'


export const checkSeatAvailability = async(showId , selectedSeats) => {
    try{
        const showData = await showModel.findById(showId)
        if (!showData) {
  console.log("Show not found for ID:", showId);
  return false;
}

        const occupiedSeats = showData.occupiedSeats || {}

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

        const showData = await showModel.findById(showId).populate('movie')

        if (!showData) {
  return res.json({
    success: false,
    message: "Show not found"
  });
}

        const booking = await bookingModel.create({
            user : userId,
            movie : showData.movie._id,
            show : showId,
            amount : showData.showPrice * selectedSeats.length,
            bookedSeats : selectedSeats
        })

        selectedSeats.map(seat => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified('occupiedSeats')

        await showData.save()

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const line_items = [{
            price_data : {
                currency : 'usd',
                product_data : {
                    name : showData.movie.title
                },
                unit_amount : Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-bookings`,
            cancel_url : `${origin}/my-bookings`,
            line_items : line_items,
            mode : 'payment',
            metadata : {
                bookingId : booking._id.toString()
            },
            expires_at : Math.floor(Date.now() / 1000) + 30 * 60,
        })

        booking.paymentLink = session.cancel_url
        await booking.save()

        res.json({success : true , url : session.url})

    }catch(err){
        console.log(err.message)
        res.json({success : false, message : err.messaege})

    }
}

export const getOccupiedSeats = async(req,res) => {
    try{
        const {showId} = req.params
        const showData = await showModel.findById(showId)

        if(!showData){
            return res.json({
                success : false,
                message : "Show not found"
            })
        }

        const occupiedSeats = Object.keys(showData.occupiedSeats || {})

        res.json({success : true, occupiedSeats})
    }catch(error){
        console.log(error.message)
    }
}
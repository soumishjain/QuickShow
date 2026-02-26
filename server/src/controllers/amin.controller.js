import bookingModel from "../models/booking.models.js";
import showModel from "../models/show.models.js";
import userModel from "../models/user.models.js";


export const isAdmin = async (req,res) => {
    res.json({success : true , isAdmin: true})
}

export const getDashboardData = async (req,res) => {
    try{
        const bookings = await bookingModel.find({isPaid : true});
        const activeShows = await showModel.find({showDateTime: {$gte : new Date()}}).populate('movie')

        const totalUser = await userModel.countDocuments()

        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue : bookings.reduce((acc,booking) => acc + booking.amount , 0),
            activeShows,
            totalUser
        }
        res.json({success : true, dashboardData})
    }catch(error){
        console.log(error.message)
        res.json({success : false, message : error.message})
    }
}


export const getAllShows = async (req,res) => {



    try{
        const shows = await showModel.find({showDateTime : {$gte : new Date()}}).populate('movie').sort({showDateTime : 1})
        res.json({success : true , shows})
    }
    
    
    catch(error){
        console.error(error);
        res.json({success : false , message : error.message})
    }
}


export const getAllBookings = async(req,res) => {
    try{
        const bookings = await bookingModel.find({}).populate({
            path : 'show',
            populate: {path: "movie"}
        }).sort({createdAt: -1})

        const userIds = bookings.map(b => b.user)

        const users = await userModel.find({id : {$in : userIds}})

        const bookingWithUser = bookings.map(booking => {
            const user = users.find(u => u.id === booking.user)
            return {
                ...booking._doc,
                user : user || null
            }
        })

        res.json({success : true , bookings})
    } catch(error){
        console.log(error)
        res.json({success : false , message : error.message})
    }
}
import { Inngest } from "inngest";
import userModel from "../models/user.models.js";
import showModel from "../models/show.models.js";
import bookingModel from "../models/booking.models.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//function to create a user from clerk
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            id : id,
            name : first_name + ' ' + last_name,
            email : email_addresses[0].email_address,
            image_url : image_url
        }
        await userModel.create(userData)
    }
)

//function to delete a user from clerk
const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-from-clerk'},
    {event : 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data
        await userModel.findOneAndDelete({id})
    }
)

//function to update a user from clerk
const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            id : id,
            name : first_name + ' ' + last_name,
            email : email_addresses[0].email_address,
            image_url : image_url
        }
        await userModel.findOneAndUpdate({id},userData)
    }
)

const releastSeatsAndDeleteBooking = inngest.createFunction(
    {id : 'release-seats-delete-booking'},
    {event : "app/checkpayment"},
    async({event , step}) => {
        const tenMinLater = new Date(Date.now() + 10 * 60 * 1000)
        await step.sleepUntil('wait-for-10-minutes', tenMinLater)

        await step.run('check-payment-status', async() => {
            const bookingId = event.data.bookingId;
            const booking = await bookingModel.findById(bookingId)

            if (!booking) return;
            if(!booking.isPaid){
                const show = await showModel.findById(booking.show)
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')

                await show.save()
                await bookingModel.markModified('occupiedSeats')
                await show.save()
                await bookingModel.findByIdAndDelete(booking._id)
            }
        })
    }
)


const sendBookingConfirmationEmail = inngest.createFunction(
    {id : "send-booking-confirmation-email"},
    {event : "app/show.booked"},
    async ({event , step}) => {

        try{
        const {bookingId} = event.data

        const booking = await bookingModel.findById(bookingId).populate({
            path: 'show',
            populate : {path : "movie"}
        })

       if (!booking) {
        console.log("Booking not found");
        return;
      }

const user = await userModel.findOne({id : booking.user})
if (!user) {
        console.log("User not found");
        return;
      }

        await sendEmail({
            to : user.email,
            subject : `Payment Confirmation: "${booking.show?.movie?.title}" booked!`,
            body : `<div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
    
    <h2 style="margin-top:0;">🎬 Booking Confirmed</h2>
    
    <p>Hi ${user.name},</p>
    
    <p>Your ticket for <strong>${booking.show?.movie?.title}</strong> is confirmed.</p>
    
    <p>
      📅 Date: ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', {
        timeZone : 'Asia/Kolkata'
      })}<br>
      ⏰ Time: ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', {
        timeZone : 'Asia/Kolkata'
      })}<br>
    </p>

    <p style="font-size:12px; color:#777;">
      Please arrive 15 minutes before showtime.
    </p>

  </div>`
        })
        console.log("Email sent Successfully")
    }catch(error){
        console.error("Email function crash:", error);
    }
    }
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releastSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];
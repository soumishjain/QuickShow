import { Inngest } from "inngest";
import userModel from "../models/user.models.js";
import showModel from "../models/show.models.js";
import bookingModel from "../models/booking.models.js";

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
        await userModel.findByOneAndDelete({id : id})
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
            email : email_addresses[0].email_addresses,
            image_url : image_url
        }
        await userModel.findByIdAndUpdate(id,userData)
    }
)

const releastSeatsAndDeleteBooking = inngest.createFunction(
    {id : 'release-seats-delete-booking'},
    {evenet : "app/checkpayment"},
    async({event , step}) => {
        const tenMinLater = new Date(Date.now() + 10 * 60 * 1000)
        await step.sleepUntil('wait-for-10-minutes', tenMinLater)

        await step.run('check-payment-status', async() => {
            const bookingId = event.data.bookingId;
            const booking = await bookingId.findById(bookingId)


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


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releastSeatsAndDeleteBooking
];
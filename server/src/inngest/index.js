import { Inngest } from "inngest";
import userModel from "../models/user.models.js";
import showModel from "../models/show.models.js";
import bookingModel from "../models/booking.models.js";
import sendEmail from "../config/nodemailer.js";
import { message } from "statuses";

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
                // await bookingModel.markModified('occupiedSeats')
                // await show.save()
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
        
        
        console.log("Email function trggered for booking: ",bookingId)
        


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

const sendShowReminders = inngest.createFunction(
    {id : "send-show-reminders"},
    {cron: "0 */8 * * *"},
    async ({step}) => {
        const now = new Date()
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000)

        const reminderTasks = await step.run("prepare-reminder-tasks" , async () => {
            const shows = await showModel.find({
                showTime : {$gte : windowStart , $lte : in8Hours}
            }).populate('movie')

            const tasks = [];

            for(const show of shows){
                if(!show.movie || !show.occupiedSeats) continue;
                const userIds = [...new set(Object.values(show.occupiedSeats))]
                if(userIds.length === 0) continue;

                const users = await userModel.find({_id : {$in: userIds}}).select("name email");

                for(const user of users){
                    tasks.push({
                        userEmail: user.email,
                        userName : user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showTime
                    })
                }
            }
            return tasks
        })
        if(reminderTasks.length === 0) {
            return {sent: 0 , message : "No reminders to send"}
        }
        const results = await step.run('send-all-reminders', async() => {
            return await Promise.allSettled(
                reminderTasks.map(task => sendEmail({
                    to:task.userEmail,
                    subject: `Reminder: Your movie "${task.movieTitle}" starts soon!!!`,
                    body : `<div style="max-width:500px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;color:#333;">

  <h2 style="margin-top:0;">🎬 Showtime Reminder</h2>

  <p>Hi ${task.userName},</p>

  <p>This is a reminder that your movie <strong>${task.movieTitle}}</strong> starts in <strong>8 hours</strong>.</p>

  <hr style="border:none;border-top:1px solid #eee;margin:15px 0;">

  <p>
    📅 Date: ${new Date(task.showTime).toLocaleDateString('en-US', {timeZone: 'Asia/Kolkata'})}<br>
    ⏰ Time: ${new Date(task.showTime).toLocaleTimeString('en-US', {timeZone: 'Asia/Kolkata'})}<br>
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:15px 0;">

  <p style="margin-bottom:5px;">Please arrive at least <strong>15 minutes early</strong> to avoid last-minute rush.</p>

  <p style="font-size:12px;color:#777;">
    Enjoy your show! 🍿
  </p>

</div>`
                }))
            )
        })


        const sent = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.length - sent

        return{
            sent,failed,
            message : `Sent ${sent} reminder(s), ${failed} failed`
        }

    }
)


const sendNewShowNotification = inngest.createFunction(
    {id : "send-new-show-notification"},
    {event: "app/show.added"},
    async ({event}) => {
        const {movieTitle} = event.data

        const users = await userModel.find({})

        for(const user of users){
            const userEmail = user.email;
            const userName = user.name;

            const subject = `New Show Added: ${movieTitle}`
            const body = `<div style="max-width:500px;margin:auto;padding:20px;font-family:Arial,Helvetica,sans-serif;color:#333;">
  
  <h2 style="margin-top:0;">🎬 New Movie Added!</h2>

  <p>Hi {{userName}},</p>

  <p>We've just added a new movie to our platform:</p>

  <p style="font-size:18px;font-weight:bold;">
    ${movieTitle}
  </p>

  <p style="margin-top:20px;">
    🎟 Book your tickets now before seats fill up!
  </p>

  <p style="font-size:12px;color:#777;margin-top:30px;">
    See you at the movies 🍿
  </p>

</div>`;

await sendEmail({
    to : userEmail,
    subject,
    body
})
}

return {message : "notification sent"}
    }
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releastSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotification

];
import { Inngest } from "inngest";
import userModel from "../models/user.models";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//function to create a user from clerk
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id : id,
            name : first_name + ' ' + last_name,
            email : email_addresses[0].email_addresses,
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
        await userModel.findByIdAndDelete(id)
    }
)

//function to update a user from clerk
const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id : id,
            name : first_name + ' ' + last_name,
            email : email_addresses[0].email_addresses,
            image_url : image_url
        }
        await userModel.findByIdAndUpdate(id,userData)
    }
)


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];
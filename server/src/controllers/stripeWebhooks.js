import Stripe from "stripe";
import bookingModel from "../models/booking.models.js";
import { inngest } from "../inngest/index.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  try {

    const event = req.body;

    console.log("EVENT TYPE:", event.type);

    if (event.type === "payment_intent.succeeded") {

      const paymentIntent = event.data.object;

      // Find checkout session linked to this payment intent
      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      if (!sessions.data.length) {
        console.log("No session found for payment intent");
        return res.json({ received: true });
      }

      const session = sessions.data[0];
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.log("No bookingId found in metadata");
        return res.json({ received: true });
      }

      await bookingModel.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: "",
      });

      await inngest.send({
        name : "app/show.booked",
        data : {bookingId}
      })

      console.log("Booking updated:", bookingId);
    }

    res.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
};
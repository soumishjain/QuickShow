import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host : "smtp-relay.brevo.com",
    port : 587,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASSWORD
    }
})

const sendEmail = async({to , subject , body}) => {
    const response = await transporter.sendMail({
        from : process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    })
    console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP PASS exists:", !!process.env.SMTP_PASSWORD);
console.log("SENDER:", process.env.SENDER_EMAIL);
    return response
}

export default sendEmail
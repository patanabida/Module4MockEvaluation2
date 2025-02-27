const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail = async (userEmail, ticketDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      cc: "patanabida1106@gmail.com",
      subject: "Ticket Booking Confirmation - TicketEase",
      html: `
        <h3>Dear Customer,</h3>
        <p>Your ticket has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>From:</strong> ${ticketDetails.from}</li>
          <li><strong>To:</strong> ${ticketDetails.to}</li>
          <li><strong>Date of Travel:</strong> ${ticketDetails.dateOfTravel}</li>
          <li><strong>Mode of Travel:</strong> ${ticketDetails.modeOfTravel}</li>
          <li><strong>Number of Passengers:</strong> ${ticketDetails.numberOfPassengers}</li>
          <li><strong>Total Price:</strong> $${ticketDetails.totalPrice}</li>
        </ul>
        <p>Thank you for choosing TicketEase!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully.");
  } catch (error) {
    console.error("Error sending booking email:", error.message);
  }
};

module.exports = { sendBookingEmail };

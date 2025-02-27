const express = require("express");
const TicketModel = require("../models/ticket.models");
const {
  authMiddlewareToken,
  authorizeAdmin,
} = require("../middlewares/authmiddleware");
const { sendBookingEmail } = require("../config/send.email");

const TicketRouter = express.Router();

// Customer: Book a Ticket
TicketRouter.post("/book", authMiddlewareToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can book tickets" });
    }

    const {
      dateOfTravel,
      modeOfTravel,
      perHeadPrice,
      from,
      to,
      numberOfPassengers,
    } = req.body;

    const newTicket = new TicketModel({
      userId: req.user.id,
      dateOfTravel,
      modeOfTravel,
      perHeadPrice,
      from,
      to,
      numberOfPassengers,
      totalPrice: perHeadPrice * numberOfPassengers,
    });

    await newTicket.save();

    // Send email confirmation
    await sendBookingEmail(req.user.email, newTicket);
    res
      .status(201)
      .json({ message: "Ticket booked successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Customer: Get Own Tickets
TicketRouter.get("/my-tickets", authMiddlewareToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can access their tickets" });
    }

    const tickets = await TicketModel.find({ userId: req.user.id });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Customer: Update Ticket (Only if more than 24 hours before travel)
TicketRouter.put("/update/:id", authMiddlewareToken, async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ticket" });
    }

    const currentTime = new Date();
    const travelTime = new Date(ticket.dateOfTravel);
    const timeDiff = (travelTime - currentTime) / (1000 * 60 * 60); // Hours difference

    if (timeDiff < 24) {
      return res
        .status(400)
        .json({ message: "Cannot modify ticket within 24 hours of travel" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Ticket updated successfully", ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin: Get All Tickets
TicketRouter.get(
  "/all",
  authMiddlewareToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const tickets = await TicketModel.find().populate("userId", "name email");
      res.json({ tickets });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Admin: Delete Ticket
TicketRouter.delete(
  "/delete/:id",
  authMiddlewareToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const ticket = await TicketModel.findByIdAndDelete(req.params.id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = TicketRouter;

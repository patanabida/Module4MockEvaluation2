const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  dateOfTravel: Date,
  modeOfTravel: { type: String, enum: ["rail", "bus"] },
  perHeadPrice: Number,
  from: String,
  to: String,
  numberOfPassengers: Number,
  totalPrice: Number,
});
TicketSchema.pre("save", async (next) => {
  this.totalPrice = this.perHeadPrice * this.numberOfPassengers;
  next();
});

const TicketModel = mongoose.model("ticket", TicketSchema);

module.exports = TicketModel;

const express  = require("express");
const ConnectedToDb = require("./config/database");
const UserRouter = require("./routes/auth.routes");
const bcrypt = require("bcrypt");
const TicketRouter = require("./routes/ticket.routes");
const { sendBookingEmail } = require("./config/send.email");
require("dotenv").config()
const PORT = process.env.PORT;
//initialize
const app = express();
//middleware
app.use(express.json());

//router
app.use("/users", UserRouter)
app.use("/ticket",TicketRouter);
// app.post("/sendemail",sendBookingEmail)

//server
// app.listen(PORT , ()=>{
//     console.log(`Server starting with the port:${PORT}`);
//     ConnectedToDb();
// })

module.exports= app
const mongoose = require("mongoose");
require("dotenv").config();

const ConnectedToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected To DB");
  } catch (err) {
    console.log("Failed to Conntecting the DB");
  }
};

module.exports = ConnectedToDb;

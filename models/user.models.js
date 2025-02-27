const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobileNumber: String,
  gender: String,
  role: { type: String, enum: ["admin", "customer"] },
});
//hashing password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;

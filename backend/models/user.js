import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true }, // unique mailadressen property
    password: String,
    userType: String,
    color: String,
    phone: String,
    note: String
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo",UserDetailsSchema);
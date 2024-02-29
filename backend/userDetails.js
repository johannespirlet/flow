import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true }, // unique mailadressen property
    password: String,
    userType: String
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo",UserDetailsSchema);
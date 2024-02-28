import mongoose from "mongoose";
export const friendSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    status: {
      type: String, // You can use "pending," "accepted," "rejected," etc.
      required: true,
      enum:['pending','accepted','rejected']
    },
    // Add any other fields relevant to your application
  });
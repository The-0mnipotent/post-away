import mongoose from "mongoose";

export const userSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid email"]
  },
  password: {
    type: String
  },
  gender:{
   type:String,
   enum:['Male','Female',"Other"],
   required: true,
  },
 tokens: [
  { 
    type: Object 
  }
],

friends:[
  {
      type:mongoose.Schema.Types.ObjectId,
      ref:"friend"
  }
]
});

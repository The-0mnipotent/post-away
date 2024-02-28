import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
 likeable:{
    type: mongoose.Schema.Types.ObjectId,
    refPath:'on_model'
 },
on_model:{
    type:String,
    enum:['Post','Comment']
} 
  
});

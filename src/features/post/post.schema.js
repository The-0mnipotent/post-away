import mongoose, { mongo } from "mongoose";

export const postSchema=new mongoose.Schema({
    
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},

caption:{
type:String,
required:true
},

imageUrl:{
  type:String,
  required:true
},
comments:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
],
likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
]
});


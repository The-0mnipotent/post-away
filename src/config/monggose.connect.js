import mongoose from "mongoose";

const url=process.env.DB_URL;
export const connecttomongoose=async ()=>{
    try{
      await  mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
      })
      console.log("Mongodb connected  usiing mongoose")
    }catch(err){
       console.log("err occurs while connecting with mogodb",err);
    }
}
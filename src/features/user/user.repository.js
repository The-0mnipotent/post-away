import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../error-handeler/error-handeler.js";

const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{
  async signUp(name, email, password, gender) {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender
        });
        await newUser.save();
        return newUser;
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate key error (unique constraint violation)
            throw new ApplicationError("This email already exists. Please use a different email or use the 'Forgot Password' or 'Login' functionality.", 400);
        } else {
            // Handle other database errors
            console.error(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
}



    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

  
    async logout(token, userId) {
      try {
          const user = await UserModel.findById(userId);
          console.log("this is user", user);
  
          const newTokens = user.tokens.filter((t) => t.token !== token);
          await UserModel.findByIdAndUpdate(
              userId,
              {
                  tokens: newTokens,
              }
          );
       
          return "Signout successful" ;
      } catch (err) {
          throw new ApplicationError("Something went wrong with the database", 500);
      }
  }

async logoutall(userId){
  try {
    
    const user = await UserModel.findById(userId);
    //console.log("this is user", user);

    await UserModel.findByIdAndUpdate(
        userId,
        {
            tokens: []
        }
    );
 
    return "Signout all device successful" ;
} catch (err) {
    throw new ApplicationError("Something went wrong with the database", 500);
}
  }

 async retriveuserdatabyid(userId){
  try{
    const user=await UserModel.findById(userId);
    user.password="***********"
    user.tokens="*********"
    return user;
  }catch(err){
    throw new ApplicationError("Something went wrong with the database", 500);
  }
  
 }

 async getalldetails() {
  try {
    const users = await UserModel.find({});

    
    const redactedUsers = users.map(user => ({
      ...user.toObject(), 
      password: '***************', 
      tokens:'***************',
    }));

    return redactedUsers;
  } catch (err) {
    console.error(err);
    throw new ApplicationError("Something went wrong with the database", 500);
  }
}

async updatedetails(name,email,password,gender,userId){
    try{
      let filter={};
       if(name){
         filter.name=name;
       }
       if(email){
        filter.email=email;
       }
       if(password){
        const hashedPassword = await bcrypt.hash(password, 12)
        filter.password=hashedPassword;
       }
       if(gender){
        filter.gender=gender;
       }
       //console.log("this is the filter",filter,"this is userId",userId);
       const user=await UserModel.findById(userId);
       if(!user){
        throw new Error("user not found please login")
       }
       await UserModel.findByIdAndUpdate(
        userId,
        filter 
    );
    const userafterupdate=await UserModel.findById(userId);
    userafterupdate.password="**********";
    userafterupdate.tokens="**********";
    return userafterupdate;

    }catch(err){
      if (err.name === 'MongoServerError' && err.code === 11000) {
        // Duplicate key error (unique constraint violation)
        throw new ApplicationError("This email already exists. Please use a different email or use the 'Forgot Password' or 'Login' functionality.", 400);
    } else {
        // Handle other database errors
        console.error(err);
        throw new ApplicationError("Something went wrong with the database", 500);
    }
    }
}



}




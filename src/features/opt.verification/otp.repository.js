import mongoose from "mongoose";
import {optSchema} from "./otp.schema.js"
import{userSchema} from "../user/user.schema.js"
import { ApplicationError } from "../error-handeler/error-handeler.js";
import {sendMail} from "../../middleware/send.opt.email.middleware.js"
import bcrypt from "bcrypt";
const UserModel = mongoose.model('User', userSchema);
const optModel=mongoose.model('Otp',optSchema);

export default class OtpRepository{

async send(email) {
    try {
      const user = await UserModel.findOne({ email: email });
  
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
  
      const userId = user._id;
      const otpAlready = await optModel.findOne({
        email: email,
        userId: userId,
      });
  
      const currentTimestamp = Date.now();
      const otpExpirationDuration = 5 * 60 * 1000; 
  
      if (otpAlready) {
        if (
          otpAlready.isVerified ||
          (otpAlready.otpExpiration && otpAlready.otpExpiration > currentTimestamp)
        ) {
        // throw new ApplicationError("An active OTP already exists", 400);
     //   console.log("this otpAlready condiction hits")
        return {
            success: false,
            message: "An active OTP already exists",
         };
        }
  
        otpAlready.otp = generateRandomFourDigitNumber();
        otpAlready.otpExpiration = currentTimestamp + otpExpirationDuration;
        otpAlready.isVerified = false;
        await sendMail(otpAlready.otp, email);
        await otpAlready.save();
        return {
            success: true,
            message: "New Opt sent Sucessfully",
         };
      } else {
        const otp = generateRandomFourDigitNumber();
        const otpExpiration = currentTimestamp + otpExpirationDuration;
  
        const newVerification = new optModel({
          email: email,
          userId: userId,
          otp: otp,
          otpExpiration: otpExpiration,
          isVerified: false,
        });
  
        await newVerification.save();
        await sendMail(otp, email);
        return {
            success: true,
            message: "New Opt sent Sucessfully",
         };
      }
    } catch (err) {
        
        if (err instanceof ApplicationError) {
            throw err;
        } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
            throw new ApplicationError("Invalid Email ID", 400);
        } else {
            
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
  }

 async verify(otp, email) {
        try {
            const userotpdata = await optModel.findOne({ email: email });
    
            if (!userotpdata) {
                return {
                    success: false,
                    message: "No OTP sent, please send the OTP",
                };
            }
    
            console.log("userotpdata", userotpdata);
    
            if (userotpdata.isVerified === true) {
                return {
                    success: true,
                    message: "OTP has already been successfully verified",
                };
            } else if (userotpdata.otp !== otp) {
                return {
                    success: false,
                    message: "Invalid OTP, please check and try again",
                };
            } else {
                const currentDateTime = new Date();
                if (userotpdata.otpExpiration <= currentDateTime) {
                    
                    return {
                        success: false,
                        message: "OTP has expired, please request a new one",
                    };
                }
    
                userotpdata.isVerified = true;
                await userotpdata.save();
                return {
                    success: true,
                    message: "OTP has been successfully verified",
                };
            }
        } catch (err) {
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid Email ID", 400);
            } else {
                
                throw new ApplicationError("Something went wrong with the database", 500);
            }
    }
}
    
async resetpassword(email, newpassword) {
        try {
            const user = await UserModel.findOne({ email: email });
    
            if (!user) {
                throw new ApplicationError("No user found. Please enter a valid email address", 400);
            }
    
            const userotpdata = await optModel.findOne({ email: email });
    
            if (!userotpdata) {
                return {
                    success: false,
                    message: "No OTP sent. Please send the OTP first.",
                };
            }
    
            const otpExpiration = userotpdata.otpExpiration;
            const currentTime = new Date();
    
            if (otpExpiration < currentTime) {
                return {
                    success: false,
                    message: "OTP has expired. Please request a new OTP.",
                };
            }
    
            if (userotpdata.isVerified === true) {
                const hashedPassword = await bcrypt.hash(newpassword, 12);
                user.password = hashedPassword;
                await user.save();
                await optModel.findOneAndDelete({ email: email });
                return {
                    success: true,
                    message: "Password successfully changed",
                };
            } else {
                if (err instanceof ApplicationError) {
                    throw err;
                }else{
                    
                    throw new ApplicationError("Please verify the OTP first before changing the password", 400);
                }
            }
        } catch (err) {
           
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid Email ID", 400);
            } else {
                
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }
    
}



function generateRandomFourDigitNumber() {
    const min = 100000; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


import  express  from "express";
import otpController from "./otp.controller.js"
const otpRoutes=express.Router();
const otpcontroller=new otpController();
otpRoutes.post('/send',
        (req,res)=>{
        otpcontroller.send(req,res);
            }
);

otpRoutes.post('/verify',
        (req,res)=>{
        otpcontroller.verify(req,res);
            }
);

otpRoutes.post('/reset-password',
        (req,res)=>{
        otpcontroller.resetpassword(req,res);
            }
);

export default otpRoutes;
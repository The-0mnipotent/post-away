import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.token.auth.js";
const userRouter=express.Router();
const userControllerr=new UserController(); 

userRouter.get('/get-details/:userId', 
        jwtAuth, 
        (req, res) => {
    userControllerr.userdatabyid(req, res);
  });

userRouter.get('/get-all-details', 
        jwtAuth, 
        (req, res) => {
    userControllerr.getalldetails(req, res);
  });

  userRouter.post(
    "/update-details/:userId", // Remove colons here
    jwtAuth,
    (req, res) => {
      userControllerr.updatedetails(req, res);
    }
  );
  
userRouter.post(
    "/signup",
    (req,res)=>{
        userControllerr.signup(req,res);
    })


userRouter.post(
    '/signin',(req,res)=>{
        userControllerr.signin(req,res); 
    } 
   
); 

userRouter.post(
    '/logout',
    jwtAuth,
    (req,res)=>{
       
        userControllerr.logout(req,res); 
    } 
   
); 
userRouter.post(
    '/logout-all-devices', 
    jwtAuth,
    (req, res) => {
        userControllerr.logoutfromalldevice(req, res);
    }
);
//userRouter.put(
//         '/resetpassword',
//         jwtAuth,
//         (req,res)=>{
//           userControllerr.resetpassword(req,res); 
//         } );

export default userRouter;


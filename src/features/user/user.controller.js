import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { userSchema } from "./user.schema.js";
const UserModel = mongoose.model('User', userSchema);

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        
    }

    async signup(req, res) {
        try {
           
            const { name, email, password ,gender} = req.body;
            const user = await this.userRepository.signUp(name, email, password,gender);
            res.status(201).send(user);
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }

   async  signin(req, res) {
     
        try{
            const user=await this.userRepository.findByEmail(req.body.email);

            console.log("this is the user in Signin",user);

            if(!user){
             return res
             .status(400)
             .send('Incorrect Credentials');
            }
         
            const result=await bcrypt.compare(req.body.password,user.password);

        if (!result){
          return res
            .status(400)
            .send('Incorrect Credentials');
        } 

      const token = jwt.sign(
         {
           userId: user._id,
           email: user.email,
         },
           process.env.JWT_SECRET,
             {
                expiresIn: '24h',
              }
        );

         let oldTokens = user.tokens || [];

         if(oldTokens.length){
            oldTokens=oldTokens.filter(t=>{
         const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
             if (timeDiff < 86400) {
             return t;
            
                }
            })
          }
         console.log("this part not need to hit after first login ")
          await UserModel.findByIdAndUpdate(
            user._id, 
            {
            tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
            });

          return res.status(200).send(token);
        }catch (err) {
            return res.status(400).send(err.message);
        }
    }

async logout(req, res) {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ success: false, message: 'Authorization fail! Token not found' });
            }
           
            const userId=req.userId;
            const message =await  this.userRepository.logout(token,userId);
            console.log("this is what we recieve",message)
            res.status(200).json({ success: true, message });
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
}

async logoutfromalldevice(req,res){
    try{

        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ success: false, message: 'Authorization fail! Token not found' });
            }
        
        const userId=req.userId;
        const message=await this.userRepository.logoutall(userId);

        res.status(200).json({ success: true, message });
        }
    }catch(err){
        return res.status(400).send(err.message);
    }
  
}

// async resetpassword(req,res){
//     const {newPassword} = req.body;
//     const hashedPassword = await bcrypt.hash(newPassword, 12)
//     const userId = req.userId;
//     try{
//         await this.userRepository.resetPassword(userId, hashedPassword)
//         res.status(200).send("Password is updated");
//       }catch(err){
//         console.log(err);
//         console.log("Passing error to middleware");
//         next(err);
//     }
// }

async userdatabyid(req,res){
    try{
    const userId = req.params.userId;
    const user=await this.userRepository.retriveuserdatabyid(userId);
    res.status(200).send(user);
    }catch(err){
        return res.status(400).send(err.message);
    }

}

async getalldetails(req, res) {
    try {
      const users = await this.userRepository.getalldetails();
      res.status(200).json(users); // Use res.json to send the users as a JSON response.
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
  
async updatedetails(req,res){
    try{
        const {name,email,password,gender}=req.body;
        const userId=req.userId;
        const updateduser=await this.userRepository.updatedetails(name,email,password,gender,userId);
        res.status(200).send(updateduser);
    }catch(err){
       return res.status(400).send(err.message);
    }


}



}
    


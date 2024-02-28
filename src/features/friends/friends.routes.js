import express from "express"
import FriendController from "./friends.controller.js"
const friendcontroller=new FriendController();
const friendsRouter=express.Router();

friendsRouter.get('/get-friends/:userId',
          (req,res)=>{
            friendcontroller.get(req,res);
          });

friendsRouter.get('/get-pending-requests',
          (req,res)=>{
            friendcontroller.getpendingrequests(req,res);
          });

friendsRouter.get('/toggle-friendship/:friendId',
          (req,res)=>{
    friendcontroller.togglefriendship(req,res);
          });
        
friendsRouter.get('/response-to-request/:friendId', (req, res) => {
            friendcontroller.responsetorequest(req, res);
          });
          

export default friendsRouter;
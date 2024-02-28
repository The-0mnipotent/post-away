import mongoose from "mongoose";
import FriendRepository from "./friends.repository.js"
export default class FriendController{
    constructor(){
     this.friendrepository=new FriendRepository();
    }
    async get(req,res){
        try{
            const userId=req.params.userId;
        const friends=await this.friendrepository.getFriend(userId);
        res.status(200).send(friends); 
        }catch(err){
            res.status(404).send(err.message); 
        }
    }

    async getpendingrequests(req, res) {
        try {
          const userId = req.userId;
          const pendingRequests = await this.friendrepository.getpendingrequests(userId);
          res.status(200).json(pendingRequests);
        } catch (err) {
          res.status(500).send(err.message); 
        }
      }
    async togglefriendship(req, res) {
        try {
          const friendId = req.params.friendId;
          const userId = req.userId;
      
          console.log("friendId", friendId, "userId", userId);
          const newFriend = await this.friendrepository.togglefriendship(userId, friendId);
      
          res.status(200).send(newFriend);
        } catch (err) {
          res.status(404).send(err.message);
        }
      }
      async responsetorequest(req, res) {
        try {
          const friendId = req.params.friendId;
          const userId = req.userId;
          const friendStatus = req.query.fstatus; // Change 'freindstatus' to 'friendStatus'
          console.log("friendId", friendId, "userId", userId, "friendStatus", friendStatus);
          const newFriend = await this.friendrepository.responsetorequest(userId, friendId, friendStatus);
          res.status(200).send(newFriend);
        } catch (err) {
          res.status(404).send(err.message);
        }
      }
      


}
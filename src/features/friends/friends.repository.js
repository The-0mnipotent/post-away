import mongoose from "mongoose";
import {friendSchema} from "./friends.schema.js"
import { ApplicationError } from "../error-handeler/error-handeler.js";
import { userSchema } from "../user/user.schema.js";

const UserModel = mongoose.model('User', userSchema);
const FriendModel=mongoose.model('friend',friendSchema);

export default class FriendRepository{
   async getFriend(userId){
       try{
         const friends=await FriendModel.find({
            userId:userId,status:'accepted'
         })  
        
         return friends;

       }catch(err){
        throw new ApplicationError("Something went wrong with the database", 500);
       }
   }

   async getpendingrequests(userId) {
    try {
      const pendingfriends = await FriendModel.find({
        friendId: userId,
        status: 'pending'
      });

      if(pendingfriends.length==0){
        return {
            "success": true,
            "message": "No pending freind request's"
          };
      }
      return pendingfriends;
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

async togglefriendship(userId, friendId) {
    try {
      const friend = await UserModel.findById(friendId);
      if (!friend) {
        return {
            "success": false,
            "message": "Friend not found"
          };
      }
  
      const existingFriendRequest = await FriendModel.findOne({
        friendId: friendId,
        userId: userId,
      });
  
      if (existingFriendRequest) {
        if (existingFriendRequest.status === 'pending') {
          return {
            success: false,
            message: "The request is pending. Kindly accept or reject it to take further action.",
            friend: null
          };
        }
  
        if (existingFriendRequest.status === 'accepted') {
          friend.friends.pull(userId);
          friend.save();
  
          const user = await UserModel.findById(userId);
          user.friends.pull(friendId);
          user.save();
  
          const friendToDelete = await FriendModel.findOneAndDelete({
            userId: userId,
            friendId: friendId,
          });
  
          return {
            success: true,
            message: "You have successfully unfriended.",
            friend: friendToDelete
          };
        }
      } else {
        const newFriend = new FriendModel({
          userId: userId,
          friendId: friendId,
          status: "pending",
        });
  
        const friendRequest = await newFriend.save();
  
        return {
          success: true,
          message: "You have successfully sent a friend request.",
          friend: friendRequest
        };
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
  
  async responsetorequest(userId, friendId, friendStatus) {
    try {
      const friendPending = await FriendModel.findOne({
        userId: friendId,
        friendId: userId,
      });
  
      if (!friendPending) {
        return {
          "success": false,
          "message": "Friend request not found"
        };
      }
      
      if (friendStatus === 'accepted') {
        friendPending.status = 'accepted';
  
        const friend = await UserModel.findById(friendId);
        friend.friends.push(userId);
        await friend.save();
  
        const user = await UserModel.findById(userId);
        user.friends.push(friendId);
        await user.save();
  
        const updatedFriend = await friendPending.save();
  
        return {
          success: true,
          message: "You have successfully accepted the request.",
          friend: updatedFriend
        };
      } else if (friendStatus === 'rejected') {
        const pendingFriend = await FriendModel.findOneAndDelete({
          userId: userId,
          friendId: friendId,
        });
  
        return {
          success: true,
          message: "You have successfully rejected the request.",
          friend: pendingFriend
        };
      } else {
        throw new ApplicationError("Invalid friend status. It should be 'accepted' or 'rejected'", 400);
      }
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
   
}
   

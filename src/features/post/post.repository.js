import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { ObjectId } from 'mongodb';

const PostModel=mongoose.model('Post',postSchema);
import { ApplicationError } from "../error-handeler/error-handeler.js";

export default class postRepository{
    async add(userId,caption,imageUrl){
       // console.log("add posts hit's")
       try{
       // console.log("this is the in repo post",post);
         const newpost=new PostModel({
            userId,
            caption,
            imageUrl
         });
         return newpost.save();
       }catch(err){
        throw new ApplicationError("Something went wrong with the database", 500);
       }
    }

    async getallposts(){
        try{
            const posts=await PostModel.find({});
            console.log("this is posts",posts);
            return posts;
        }catch(err){
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
    async getpostbyid(postId){
        try{
            const post=await PostModel.findById(postId);
            if(!post){
                throw new ApplicationError("post not found", 404);
            }else{
                return post;
              }
        }catch(err){
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid post ID", 400);
            } else {
                
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async postbyuserid(userid) {
        console.log("post repository hits");
        console.log("this is userid",userid);
        try {
            const userposts = await PostModel.find({ userId: userid});
            console.log(userposts);

            if (userposts.length === 0) {
                throw new ApplicationError("No posts found for this user", 404);
            }
            return userposts;
        } catch (err) {
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid post ID", 400);
            } else {
            
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }

    async delete(userId, postId) {
        try {
            const post = await PostModel.findById(postId);
            if (!post) {
                throw new ApplicationError("Post not found", 404);
            }
    
            if (post.userId.toString() !== userId) {
                throw new ApplicationError("This post does not belong to the user, and you cannot delete it", 400);
            }
    
            await PostModel.findByIdAndDelete(postId);
            return post;
        } catch (err) {
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid post ID", 400);
            } else {
               
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }
    
    async update(userid, postid, caption, imageUrl) {
        try {
            let update = {};
    
            if (caption) {
                update.caption = caption;
            }
    
            if (imageUrl) {
                update.imageUrl = imageUrl;
            }
      
            const post = await PostModel.findById(postid);
           
            if (!post) {
                throw new ApplicationError("Post not found", 404);
            } else {
                if (post.userId.toString() !== userid) {
                   // console.log("this part hits means this is not user post");
                    throw new ApplicationError("This post does not belong to the user, and you can't update it", 400);
                }
    
                const updatedPost = await PostModel.findByIdAndUpdate(postid, update, { new: true });
    
                if (!updatedPost) {
                    throw new ApplicationError("Failed to update the post", 500);
                }
    
                return updatedPost;
            }
        } catch (err) {
            if (err instanceof ApplicationError) {
                throw err;
            } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
                throw new ApplicationError("Invalid post ID", 400);
            } else {
                
                throw new ApplicationError("Something went wrong with the database", 500);
            }
        }
    }
    
      
     
}



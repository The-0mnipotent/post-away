import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import {likeSchema} from "./like.schema.js"
import { postSchema } from "../post/post.schema.js";
import {commentSchema} from "../comment/comment.schema.js"
import { ApplicationError } from "../error-handeler/error-handeler.js";
const PostModel=mongoose.model('Post',postSchema);
const CommentModel=mongoose.model("Comment",commentSchema);
const LikeModel=mongoose.model('Like',likeSchema)

export default class likeRepository{

async toggle(userId, Id, type) {
    console.log("userId", userId, "Id", Id, "type", type);
    try {
      if (type === 'Post') {
        console.log("this post if part hits");
        const post = await PostModel.findById(Id);
        console.log("this is post", post);
        if (!post) {
          throw new ApplicationError("Post not found", 404);
        }
  
        const like = await LikeModel.findOne({ userId, likeable: Id, on_model: 'Post' });
        console.log("this is like", like);
  
        if (!like) {
          post.likes.push(userId);
          post.save();
          console.log(post);
  
          const newLike = new LikeModel({
            userId: new ObjectId(userId),
            likeable: new ObjectId(Id),
            on_model: 'Post'
          });
  
          return newLike.save();
        } else {
          console.log("already likes part hits");
          post.likes.pull(userId);
          post.save();
  
          const deletedLike = await LikeModel.findOneAndDelete({ userId, likeable: Id, on_model: 'Post' });
          return deletedLike;
        }
      } else if (type === 'Comment') {
        console.log("comment like part hits");
        const comment = await CommentModel.findById(Id);
        console.log("comment", comment);
        if (!comment) {
          throw new ApplicationError("Comment not found", 404);
        }
  
        const like = await LikeModel.findOne({ userId, likeable: Id, on_model: 'Comment' });
        console.log("like", like);
  
        if (!like) {
          comment.likes.push(userId);
          comment.save();
  
          const newLike = new LikeModel({
            userId: new ObjectId(userId),
            likeable: new ObjectId(Id),
            on_model: 'Comment'
          });
  
          return newLike.save();
        } else {
        
          comment.likes.pull(userId);
          comment.save();
  
          const deletedLike = await LikeModel.findOneAndDelete({ userId, likeable: Id, on_model: 'Comment' });
          return deletedLike;
        }
      } else {
        throw new ApplicationError("Invalid like type", 400);
      }
    } catch (err) {
      if (err instanceof ApplicationError) {
        throw err;
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
         throw new ApplicationError("Invalid Like ID", 400);
    } else {
        
        throw new ApplicationError("Something went wrong with the database", 500);
    }
    }
  }

  async getlikes(Id) {
    try {
      const likes = await LikeModel.find({ likeable: Id });
      if (!likes || likes.length === 0) {
        throw new ApplicationError("Likes not found", 404);
      }
      return likes;
    } catch (err) {
      if (err instanceof ApplicationError) {
        throw err;
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        throw new ApplicationError("Invalid like ID", 400);
    } else {
        
        throw new ApplicationError("Something went wrong with the database", 500);
    }
    }
  }


  
}
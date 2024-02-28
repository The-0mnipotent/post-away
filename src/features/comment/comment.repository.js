import mongoose from "mongoose";
import {commentSchema} from "./comment.schema.js"
import { ApplicationError } from "../error-handeler/error-handeler.js";
import { postSchema } from "../post/post.schema.js";
import { ObjectId } from 'mongodb';
import { userSchema } from "../user/user.schema.js";


const UserModel = mongoose.model('User', userSchema);
const PostModel=mongoose.model('Post',postSchema);
const CommentModel=mongoose.model('Comment',commentSchema);


export default class commentRepository{
  
    async add(postId, userId, content) {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new ApplicationError("Post not found", 404);
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }

        const newcomment = new CommentModel({
            userId,
            postId,
            content
        });

        post.comments.push(newcomment);
        await post.save();

        return newcomment.save();
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
  
async  getcommentpostwise(postId){
    try{
        const commentsbypostall=await CommentModel.find({postId:postId})
        if(!commentsbypostall){
          throw new ApplicationError("comment not found", 404);
        }

        return commentsbypostall;
        
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

async delete(commentId, userId) {
    try {
        const comment = await CommentModel.findById(commentId);

        if (comment.userId.toString() !== userId) {
            throw new ApplicationError("Cannot delete the comment that does not belong to the current user", 400);
        }

        // Remove the comment from the PostModel
        const post = await PostModel.findOneAndUpdate(
            { 'comments': commentId },
            { $pull: { comments:commentId } } 
        );

    
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);
        return deletedComment;
    } catch (err) {
        if (err instanceof ApplicationError) {
            throw err;
        } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
            throw new ApplicationError("Invalid comment ID", 400);
        } else {
            
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
}

async  update(commentId,userId,content){
try{

    const commentfind=await CommentModel.findById(commentId);
    
    if(!commentfind){
        throw new ApplicationError("comment not found", 404);
    }
    if (commentfind.userId.toString() !== userId) {
        throw new ApplicationError("Cannot update the comment that does not belong to the current user", 400);
    }
   
    commentfind.content=content;
    return commentfind.save();
   
}catch(err){
    if (err instanceof ApplicationError) {
        throw err;
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        throw new ApplicationError("Invalid comment ID", 400);
    } else {
        
        throw new ApplicationError("Something went wrong with the database", 500);
    }
}

}


}


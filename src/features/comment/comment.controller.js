
import commentRepository from "./comment.repository.js";
 export default class commentcontroller{
     constructor(){
      this.commentrepository=new commentRepository();
     }
     async addComment(req, res) {
      try {
          const postId = req.params.postId;
          const userId = req.userId;
          const content = req.body.content;
          const commentRes = await  this.commentrepository.add(postId, userId, content);
          res.status(201).send(commentRes);
      } catch (err) {
          res.status(err.code || 500).send(err.message);
      }
  }
async getcommentpostwise(req,res){
    try{
        const postId=req.params.postId;
       const comments=await this.commentrepository.getcommentpostwise(postId);
       res.status(200).send(comments);

    }catch(err){
           res.status(404).send(err.message);
    } 
  }

//   getallcommentuserwise(req,res){
//     try{
//       const userid=req.userId;
//      const comments=commentModel.getcommentuserwise(userid);
//      res.status(200).send(comments);

//   }catch(err){
//          res.status(404).send(err.message);
//   } 
// }
  
  // getcomment(req,res){
  //   try{
  //       const postid=req.params.id;
  //       const userid=req.userId;
  //      const comments=commentModel.getcommentall(postid,userid);
  //      res.status(200).send(comments);

  //   }catch(err){
  //          res.status(404).send(err.message);
  //   } 
  // }

 async  updatecomment(req,res){
    try{
        const commentId=req.params.commentId;
        const userId=req.userId;
        const content=req.body.content;
       const commentrec=await this.commentrepository.update(commentId,userId,content);
       res.status(200).send(commentrec);

    }catch(err){
        res.status(404).send(err.message);
    } 
  }

  async deletecomment(req, res) {
    try {
        const commentId = req.params.commentId;
        const userId = req.userId;
        const deletedComment = await this.commentrepository.delete(commentId, userId);
        res.status(200).send(deletedComment);
    } catch (err) {
        res.status(err.code || 500).send(err.message);
    }
}
   
}
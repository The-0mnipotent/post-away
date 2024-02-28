import express from 'express';
import commentcontroller from "./comment.controller.js"

const commentRouter=express.Router();
const commentcontrollerr=new commentcontroller();

commentRouter.post("/:postId",
      (req,res)=>{
        commentcontrollerr.addComment(req,res);
      }

);

//commentRouter.get("/getallucomment",commentcontrollerr.getallcommentuserwise);

commentRouter.get("/:postId",
   (req,res)=>{
    commentcontrollerr.getcommentpostwise(req,res);
   }
);

//commentRouter.get("/get/:id",commentcontrollerr.getcomment);



commentRouter.put("/:commentId",
                (req,res)=>{
     commentcontrollerr.updatecomment(req,res);
                }
);

commentRouter.delete("/:commentId",
       (req,res)=>{
        commentcontrollerr.deletecomment(req,res);
       }
);

export default commentRouter;

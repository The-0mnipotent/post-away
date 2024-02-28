import express from "express"
import likeController from "./like.controller.js";
const likeControllerr=new likeController();
const likesRouter=express.Router();

likesRouter.get("/:id",
    (req,res)=>{
      likeControllerr.getalllike(req,res);
    }
);

likesRouter.post("/toggle/:id",
              (req,res)=>{
                likeControllerr.togglelike(req,res);
              }
             );


export default likesRouter;
import express from 'express';
import PostController from "./post.controller.js"
import {upload} from '../../middleware/upload.image.middleware.js';

const postRouter=express.Router();
const PostControllerr=new PostController();
//this is create new posts
postRouter.post('/',  
        upload.single('imageUrl'),
                 (req,res)=>{
                  PostControllerr.addpost(req,res);
                 }
              
               );
//this is reoute to get all the post
postRouter.get('/all',
           (req,res)=>{
         PostControllerr.getallposts(req,res);
           }
             
           );
//retrive a specific post by postId
postRouter.get('/:postId',
           (req,res)=>{
            PostControllerr.getbyid(req,res);
           });
//get all the posts by a user
postRouter.get('/',
            (req,res)=>{
         PostControllerr.getpostbyuserid(req,res);
             });
//route to update the post 
// postRouter.put(
//   '/:postId',
//   (req, res, next) => {
//     console.log("this is an update profile top image upload");
//     if (req.body.imageUrl) {
//       // Use the `upload.single` middleware here
//       console.log("req.body.imageUrl:", req.body.imageUrl);
//       upload.single('imageUrl')(req, res, (err) => {
//         if (err) {
//           return res.status(400).send('Image upload error');
//         }
//         next();
//       });
//     } else {
//       next();
//     }
//   },
//   (req, res) => {
//     PostControllerr.updatepost(req, res);
//   }
// );


postRouter.put(
  '/:postId',
      upload.single('imageUrl'),
    (req, res) => {
    PostControllerr.updatepost(req, res);
  }
);

 postRouter.delete('/:postId',
              (req,res)=>{
              PostControllerr.deletepost(req,res);
              });

export default postRouter;


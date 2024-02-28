import postRepository from "./post.repository.js";
export default class PostController{
    constructor(){
        this.postrepository=new postRepository();
    }
 async addpost(req,res){
    console.log("post controller add post hits")
    try{
        const userId=req.userId;
        const imageUrl=req.file.filename;
        const{caption}=req.body;
       const newpost= await this.postrepository.add(userId,caption,imageUrl);
        res.status(201).send(newpost);
    }catch(err){
        return res.status(400).send(err.message);
    }     
    }


   async  getallposts(req,res){
        const posts=await this.postrepository.getallposts();
        res.status(200).send(posts);
    }

   async  getbyid(req,res){
       try{
        const postId=req.params.postId;
        const post=await this.postrepository.getpostbyid(postId);
        res.status(200).send(post);
       }catch(err){
        res.status(404).send(err.message);
       }
    }
  async getpostbyuserid(req,res){
    console.log("this getpostbyuserid hits")
        try{
            const userId=req.userId;
            console.log("userId",userId);
           const posts=await this.postrepository.postbyuserid(userId);
           res.status(200).send(posts);
        }catch(err){
            res.status(404).send(err.message);
        }
    }

    async updatepost(req, res) {
        try {
          const userId = req.userId;
          const postId = req.params.postId;
          let imageUrl;
      
          // Check if a file was uploaded
          if (req.file) {
            imageUrl = req.file.filename;
            console.log("this is imageUrl", imageUrl);
          }
          console.log("this is req.body",req.body);
          const { caption } = req.body;
          console.log("userId", userId, "postId", postId, "imageUrl", imageUrl, "caption", caption);
          const post = await this.postrepository.update(userId, postId, caption, imageUrl);
          res.status(200).send(post);
        } catch (err) {
          res.status(404).send(err.message);
        }
      }
      

   async deletepost(req,res){
        try{
            console.log("delte porduct's hits");
            const userId=req.userId;
            const postId=req.params.postId
           // console.log("userid",userid,"postid",postid);
           const post= await this.postrepository.delete(userId,postId);
           res.status(200).send(post);
        }catch(err){
            res.status(404).send(err.message);
        }
    }

 
}

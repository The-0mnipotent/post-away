import mongoose from "mongoose";
import likeRepository from "./like.repository.js";
export default class likeController{
     constructor(){
        this.likerepository= new likeRepository();
}
async togglelike(req, res) {
    try {
      const userId = req.userId;
      const type = req.query.type;
      const Id = req.params.id;
      const ret = await this.likerepository.toggle(userId, Id, type);
      res.status(200).send(ret);
    } catch (err) {
      res.status(404).send(err.message);
    }
  }

  async getalllike(req, res) {
    try {
      const Id = req.params.id;
      const likes = await this.likerepository.getlikes(Id);
      res.status(200).send(likes);
    } catch (err) {
      res.status(err.code || 500).send(err.message);
    }
  }
}
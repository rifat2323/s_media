import { Request,Response } from "express";

import sanitize from "sanitize-html";
import LikeCommentSchema from "../../models/CountLike";
import mongoose from "mongoose";


export const getSingalePost =  async(req:Request,res:Response)=>{
 const id = sanitize(req.params.id)

if (!id || !mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).send("A valid postId is required");
}

const post = await LikeCommentSchema.findOne({postId:id}).lean().populate({
  path:"postId",
  populate:{
     path:"userId",
     select:"_id name profilePicture"
  }
  
})
 if(!post){
    return res.status(404).send("post not found")
 }
 return res.status(200).json(post)
   
}
export const getSingaleLike = async(req:Request,res:Response)=>{
    const id = sanitize(req.params.id)
    if(!id){
      return res.status(400).send("a  postId is required")
    }
    const likes   = await LikeCommentSchema.findOne({postId:id}).select("LikeCount").lean()
    if(!likes){
      return res.status(404).send("Like not found")
    }
    
   return res.status(200).json(likes)
}

export const getSingaleComment = async (req:Request,res:Response)=>{
    const id = sanitize(req.params.id)
    if(!id){
      return res.status(400).send("a  postId is required")
    }
  const comment  = await LikeCommentSchema.find({postId:id}).select("commentCount").lean()
  if(!comment){
    return res.status(404).send("comment not found")
  }
  return res.status(200).json(comment)

}
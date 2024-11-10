import mongoose from "mongoose";
import User from "../../models/User";
import { ExtraReq } from "../../type";
import {Response } from "express";

import  sanitize  from 'sanitize-html';
import LikeCommentSchema from "../../models/CountLike";
import Friend from "../../models/Friend";



export const getVisit = async (req:ExtraReq,res:Response)=>{
    const id  =  sanitize(req.query.userId as string) 
    if(!id || !mongoose.Types.ObjectId.isValid(id))  {
        return res.status(400).send("A valid userId is required")
    }
    const findUser = await User.findOne({_id:id}).select(" _id name profilePicture createdAt CoverPhoto bio ").lean()
    if(!findUser)  {
        return res.status(404).send("User not found")
    }

    return res.status(200).json(findUser)
}

export const getUserPost = async (req:ExtraReq,res:Response)=>{

    const id  =  sanitize(req.query.userId as string) 
    if(!id || !mongoose.Types.ObjectId.isValid(id))  {
        return res.status(400).send("A valid userId is required")
    }
    const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
    const query = cursor ? {posterId:id,createdAt:{$lt:cursor}}:{posterId:id}

    const post = await  LikeCommentSchema.find(query).limit(10).sort({createdAt:-1}).lean().populate({
        path:"postId",
        populate:{
           path:"userId",
           select:"_id name profilePicture"
        }
        
     })
     if(post.length === 0) {
        return res.status(400).json({post:[]})
    }
     
  const sendCursor  = post.length > 0 ? post[post.length - 1].createdAt : null;

  return res.status(200).json({post,sendCursor})
  
}


export const getUserFriend = async (req:ExtraReq,res:Response)=>{
    const id  =  sanitize(req.query.userId as string) 
    if(!id || !mongoose.Types.ObjectId.isValid(id))  {
        return res.status(400).send("A valid userId is required")
    }

    const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
    const query = cursor ? {userId:id,createdAt:{$lt:cursor}}:{userId:id}

    const post = await  Friend.find(query).limit(10).sort({createdAt:-1}).select("FriendId createdAt").lean().populate({
        path:"FriendId",
        select:"_id name profilePicture"
        
     })
     if(post.length === 0) {
        return res.status(400).json({post:[]})
    }
  const sendCursor  = post.length > 0 ? post[post.length - 1].createdAt : null;

  return res.status(200).json({post,sendCursor})

}
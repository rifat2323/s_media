import sanitize from "sanitize-html";
import { ExtraReq } from "../../type";
import { Response } from "express";
import User from "../../models/User";
import Post from "../../models/Post";


export const SearchUser = async(req:ExtraReq,res:Response) => {
   const keyword = sanitize(req.query.keyword as string)
   const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;

   const query = cursor ? {name:{$regex:keyword,$options:"i"},createdAt:{$lt:cursor}}:{name:{$regex:keyword,$options:"i"}}
   const user = await User.find(query).limit(10).sort({createdAt:-1}).select("_id name profilePicture createdAt").lean()
   const sendCursor = user.length > 0 ? user[user.length - 1].createdAt : null
   return res.status(200).json({user,sendCursor})


}
export const SearchPost = async(req:ExtraReq,res:Response) => {
   const keyword = sanitize(req.query.keyword as string)
   const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;

   const query = cursor ? {textContent:{$regex:keyword,$options:"i"},createdAt:{$lt:cursor}}:{textContent:{$regex:keyword,$options:"i"}}
   const post = await Post.find(query).limit(10).sort({createdAt:-1}).populate({
      path:"userId",
      select:"_id name profilePicture"
   }).lean()
   const sendCursor = post.length > 0 ? post[post.length - 1].createdAt : null
   return res.status(200).json({post,sendCursor})


}
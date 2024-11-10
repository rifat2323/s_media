import { ExtraReq } from "../../type"
import { Response } from "express"
import sanitize from "sanitize-html"
import Comment from "../../models/Comment"
import { getSocket } from "../../funcation/soket"

import Notification from "../../models/Notification"
import LikeCommentSchema from "../../models/CountLike";

const io = getSocket()

/**
 * Creates a new comment for a given post.
 * @param req - An Express request object with a middleware attached property of userId, and a body containing a comment and postId.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the newly created comment if successful, or a 400 status code with an error message if either the comment or postId is missing.
 */
export const CreateComment = async (req:ExtraReq,res:Response)=>{
 const id = req.userId
 const posterId = sanitize(req.query.posterId as string)
 if(!posterId){
   return res.status(404).send("need posterId")
 }
 const userImg = req.userImg
 const userName = req.userName
 const comment = sanitize(req.body.comment as string)
 const postId = sanitize(req.body.postId as string)
 if(!comment || !postId){
    return res.status(400).send("a comment and postId is required")
 }

  await Promise.all([
    Comment.create({userId:id,postId:postId,content:comment}),
    LikeCommentSchema.findOneAndUpdate({postId:postId},{$inc:{commentCount:1}},{upsert:true}),
   Notification.create({ 
      postId:postId,
     commenterName:userName,
     commenterImg:userImg,
     type:"comment",
     posterId:posterId,
     commenterId:id
   })

     
  ])


 // this is for whom i sending a notification
 if(io){
   io.to(posterId).emit("new_comment",{
      postId:postId,
      commenterName:userName,
      commenterImg:userImg,
      type:"comment"
   })

 }

 return res.status(200).json({newComment:true})

}
/**
 * Updates an existing comment for a given post.
 * @param req - An Express request object with a middleware attached property of userId, and a body containing a comment and postId.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the updated comment if successful, or a 400 status code with an error message if either the comment or postId is missing, or a 404 status code if the comment was not found.
 */
export const PatchComment = async (req:ExtraReq,res:Response)=>{
 const id = req.userId
 const comment = sanitize(req.query.comment as string)
 const postId = sanitize(req.query.postId as string)
 const commentId = sanitize(req.query.commentId as string)
 if(!comment || !postId){
    return res.status(400).send("a comment and postId is required")
 }
 const existingComment = await Comment.findOneAndUpdate({userId:id,postId:postId,_id:commentId},{
    content:comment
 },{
    new:true,
    upsert:true
 })
 if(!existingComment){
    return res.status(404).send("comment not found")
 }
 
 return res.status(200).json(existingComment)

}



export const getMostCommentedPost = async (req:ExtraReq,res:Response)=>{
   const  cursor = req.query.cursor as string || null
   const query = cursor && cursor !== "null" || null ? {commentCount:{$lt:cursor}}:{}
     
 
    const post = await LikeCommentSchema.find(query).sort({commentCount:-1}).limit(20).lean().populate({
        path:"postId",
        populate:{
            path:"userId",
            select:"_id name profilePicture"
        }
      }
    )
    if(post.length === 0){
      return res.status(400).json({post:[]})
    }
     const sendCursor  =post.length > 0 ? post[post.length - 1].commentCount : null
     return res.status(200).json({post,sendCursor})
 
 
 }
export const getComment = async (req:ExtraReq,res:Response)=>{
   const  cursor = sanitize(req.query.cursor as string) || null
   const postId = sanitize(req.query.postId as string)
   const query = cursor ? {postId:postId,createdAt:{$lt:cursor}}:{postId:postId}
     
 
    const post = await Comment.find(query).sort({createdAt:-1}).limit(15).lean().populate({
      path:"userId",
      select: "_id name profilePicture"
    })
     const sendCursor  = post.length > 0 ? post[post.length - 1].createdAt : null
     return res.status(200).json({post,sendCursor})
 

 }
export const getCommentCount = async (req:ExtraReq,res:Response)=>{
  const postId = sanitize(req.query.postId as string)
  const post = await LikeCommentSchema.findOne({postId:postId}).lean()
    return res.status(200).json({commentCount:post?.commentCount})
}



export const deleteComment = async (req:ExtraReq,res:Response)=>{
  const id = req.userId
  
  const commentId = sanitize(req.query.commentId as string)
  
  const deleteComment  =  await Comment.findOneAndDelete({userId:id,_id:commentId}).lean()
  if(!deleteComment){
     return res.status(404).send("comment not found")
  }
 return res.status(200).send({deleted:true})
}
export const s = async (_req:ExtraReq,res:Response)=>{

  
  const t  =  await LikeCommentSchema.findOne({postId:"6729d3202c9f94df6806c370"})
  if (t) {
   t.LikeCount = 10000;
   await t.save();
 }

 return res.status(200).send({deleted:true})
}
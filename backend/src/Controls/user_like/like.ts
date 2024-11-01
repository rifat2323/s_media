import Like from "../../models/Like";
import { ExtraReq } from "../../type";
import { Response } from "express";
import sanitize from "sanitize-html";
import LikeCommentSchema from "../../models/CountLike";
import { getSocket } from "../../funcation/soket"
import Notification from "../../models/Notification";

const io = getSocket()


/**
 * Creates or updates a like for a post.
 * @param req - An Express request object containing the user's ID, the post's ID, and the poster's ID.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the message "liked" if the user has liked the post before, or a 200 status code with the message "unliked" if the user has not liked the post before.
 */
export const createOrUpdateLike =  async (req:ExtraReq,res:Response)=>{

    const id = req.userId
    const userName = req.userName
    const userImg = req.userImg
    const posterId = sanitize(req.query.posterId as string)
    const postId = sanitize(req.query.postId as string)
    if(!postId || !posterId){
        return res.status(400).send("postId is required")
    }

    const existingLike = await Like.findOne({postId:postId,userId:id}).lean()
    if(existingLike){
         await Promise.all([

          LikeCommentSchema.findOneAndUpdate(
                { postId },
                { $inc: { LikeCount: -1 } },
                { upsert: true } 
            ),

             Like.deleteOne({postId:postId,userId:id}),
          

        ])
        
        return res.status(200).send("unliked")
    }
    

  await Promise.all([
    LikeCommentSchema.findOneAndUpdate(
        { postId },
        { $inc: { LikeCount: 1 } },
        { upsert: true } 
    ),

     Like.create({postId:postId,userId:id}),
    Notification.create({ 
      postId:postId,
     commenterName:userName,
     commenterImg:userImg,
     type:"liked",
     posterId:posterId,
     commenterId:id
   })


  ])
  if(io){
    io.to(posterId).emit("new_like",{
        postId:postId,
      commenterName:userName,
      commenterImg:userImg,
      type:"liked"
    })
  }

  
  return res.status(200).send("liked")
    
}



/**
 * Returns the 20 most liked posts. If a cursor is provided, it will return the 20 posts with the most likes that have a LikeCount less than the cursor.
 * @param req - An Express request object with a query containing a cursor.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with a JSON object containing the 20 most liked posts, or an empty array if no posts were found. The JSON object will also contain a "cursor" property with the LikeCount of the last post in the array, or null if no posts were found.
 */
export const getMostLikePost = async (req:ExtraReq,res:Response)=>{
  const  cursor = sanitize(req.query.cursor as string) || null
  const query = cursor && cursor !== "null" || null ? {LikeCount:{$lt:cursor}}:{}
    

   const post = await LikeCommentSchema.find(query).sort({LikeCount:-1}).limit(20).lean().populate({
    path:"postId",
    populate:{
        path:"userId",
        select:"_id name profilePicture"
    }
  })
    const sendCursor  = post.length > 0 ? post[post.length - 1].LikeCount : null
    return res.status(200).json({post,sendCursor})


}



export const getLike = async (req:ExtraReq,res:Response)=>{
  const  cursor = sanitize(req.query.cursor as string) || null
  const postId = sanitize(req.query.postId as string)
  const query = cursor ? {postId:postId,createdAt:{$lt:cursor}}:{postId:postId}
    

   const post = await Like.find(query).sort({createdAt:-1}).limit(15).lean().populate("userId, _id name profilePicture")
    const sendCursor  = post.length > 0 ? post[post.length - 1].createdAt : null
    return res.status(200).json({post,sendCursor})


}

export const getLikeCount = async (req:ExtraReq,res:Response)=>{
  const postId = sanitize(req.query.postId as string)
  const post = await LikeCommentSchema.findOne({postId:postId}).lean()
    return res.status(200).json({LikeCount:post?.LikeCount})
}

export const isLikedPost = async (req:ExtraReq,res:Response)=>{
  const id = req.userId
  const postId = sanitize(req.query.postId as string)
  const post = await Like.exists({postId:postId,userId:id})
  if(!post){
    return res.status(404).json({liked:false})
  }
  return res.status(200).json({liked:true})
  
}


import {  Response } from "express";
import sanitize from "sanitize-html";
import SavePost from "../../models/SavePost";
import { ExtraReq } from "../../type";
import LikeCommentSchema from "../../models/CountLike";



/**
 * Creates a new save post for a user.
 * @param req - An Express request object containing the user's ID and the post's ID.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the newly created save post if successful, or a 400 status code with an error message if the post ID is missing or if the post is already saved.
 */
export const createSavePost =  async (req:ExtraReq,res:Response)=>{
    
    const id  =  sanitize(req.query.id as string)
    //should get it from middleware
    const userId = req.userId

    if(!id) {
        return res.status(400).send(" id required for save a post")
    }
    const findExistingOne = await SavePost.findOne({postId:id,userId:userId}).lean()
    if(findExistingOne){
        return res.status(400).send("Already saved")
    }
    const newSave =  await SavePost.create({postId:id,userId:userId})
    
    return res.status(200).json(newSave)



}
/**
 * Retrieves a list of saved posts for a user, paginated.
 * @param req - An Express request object containing the user's ID and the page number.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the list of saved posts if successful, or a 400 status code with an error message if the page number is invalid.
 */
export const getSavePost =  async (req:ExtraReq,res:Response)=>{
    
  
    //should get it from middleware
    const userId = req.userId
    const page =  sanitize(req.query.page as string) 
    if(!page || parseInt(page) < 0 ||isNaN(parseInt(page)) ){
        return res.status(400).send("invalid page number")
        
    }
    const pages  = parseInt(page) || 0


   
    const findSavePost = await SavePost.find({userId:userId}).select("postId -_id").sort({createdAt:-1}).skip(10*pages).limit(10).lean()
    console.log(findSavePost)
    const postIds = findSavePost.map((item) => item.postId);
    console.log(postIds)
    const savedPost =  await   LikeCommentSchema.find({postId:{$in:postIds}}).lean().populate({
        path:"postId",
        populate:{
           path:"userId",
           select:"_id name profilePicture"
        }
        
     })
     if(savedPost.length === 0){
        return res.status(404).send("No more saved post found")
     }
    
  return res.status(200).json(savedPost)
    
   



}
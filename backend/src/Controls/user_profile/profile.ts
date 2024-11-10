import { Response } from 'express'
import User from '../../models/User'
import { ExtraReq } from '../../type'
import ImageKit from 'imagekit';
import { unlink } from "node:fs";
import * as fs from 'node:fs'
import Friend from '../../models/Friend';

import LikeCommentSchema from '../../models/CountLike';
import sanitize from 'sanitize-html';

const imagekit = new ImageKit({
    publicKey : process.env.imgKit_Public_key_three as string,
    privateKey : process.env.imgKit_privateKey_three as string,
    urlEndpoint : process.env.imgKit_urlEndpoint_three as string
 
 });
 //?have to add user id from req.id from middleware later
 export const ProfilePictureUpload = async (req:ExtraReq,res:Response)=>{
    const id = req.userId
 
     // const userId = sanitize(req.body.userId)
     
 
       const file = req.file
      const type = file?.mimetype
      let mediaURl:string | null = null;
       //checking at last one is there
      
       //checking file type
       if(file){
         
          if(!type?.includes("image") && !type?.includes("video") ){
             return res.status(404).send("invalid file type")
          }
         
          
          const fileBuffer = fs.readFileSync(file.path);
          //uploading image for post
          const s = await imagekit.upload({
             file:fileBuffer,
             fileName:file.originalname,
             transformation:{
                pre: 'width:100,height:100,quality:100',
                post:[{ 
                   type:"transformation",
                   value:'width:60,height:60,quality:80'
                }]
             }
             
            
              
              
            })
           
           mediaURl = s.url
          
               
               unlink(file?.path,(error)=>{
                 console.log(error)
               })
          
            
           
          
       }
      
         
 
     const profileImg = await User.findByIdAndUpdate(id,{profilePicture:mediaURl},{new:true}).lean()
     if(!profileImg){
        return res.status(404).send("oppps somthing wrong")
     }
     return res.status(201).json({user:{id:profileImg._id,name:profileImg.name,img:profileImg.profilePicture,coverPhoto:profileImg.CoverPhoto}})
      
    
    
      
 
 }

 export const UpdloadCoverPhoto = async (req:ExtraReq,res:Response)=>{
    const id = req.userId
 
    // const userId = sanitize(req.body.userId)
    

      const file = req.file
     const type = file?.mimetype
     let mediaURl:string | null = null;
      //checking at last one is there
     
      //checking file type
      if(file){
        
         if(!type?.includes("image") && !type?.includes("video") ){
            return res.status(404).send("invalid file type")
         }
        
         
         const fileBuffer = fs.readFileSync(file.path);
         //uploading image for post
         const s = await imagekit.upload({
            file:fileBuffer,
            fileName:file.originalname,
            transformation:{
               pre: 'width:100,height:100,quality:100',
               post:[{ 
                  type:"transformation",
                  value:'width:80,height:80,quality:80'
               }]
            }
            
           
             
             
           })
          
          
          mediaURl = s.url
          
          
              
              unlink(file?.path,(error)=>{
                console.log(error)
              })
         
           
          
         
      }
     
  
    const profileImg = await User.findByIdAndUpdate(id,{CoverPhoto:mediaURl},{new:true}).lean()
          
    if(!profileImg){
      return res.status(404).send("oppps somthing wrong")
   }
   return res.status(201).json({user:{id:profileImg._id,name:profileImg.name,img:profileImg.profilePicture,coverPhoto:profileImg.CoverPhoto}})
   
 }
export const getUserProfile = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const user = await User.findById(id).select("name profilePicture _id CoverPhoto").lean()
    if(!user){
        return res.status(401).send("unauthorized")
    }
    return res.status(200).json({id:user._id,name:user.name,img:user.profilePicture,coverPhoto:user.CoverPhoto})
    
}
export const getUserPost = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;


    const query = cursor ? {posterId:id,createdAt:{$lt:cursor}}:{posterId:id}
   
    const user =  await  LikeCommentSchema.find(query).limit(10).sort({createdAt:-1}).lean().populate({
      path:"postId",
      populate:{
         path:"userId",
         select:"_id name profilePicture"
      }
      
   })
    if(user.length === 0){
        return res.status(404).send("can't find")
    }
    const sendCursor  = user.length > 0 ? user[user.length - 1].createdAt : null;
    return res.status(200).json({post:user,sendCursor})
}
export const getUserFriend = async (req:ExtraReq,res:Response)=>{
    const id = req.userId
    const cursor =  req.query.cursor as string
  const query = cursor ? {userId:id,createdAt:{$lt:cursor},status:"approved"}:{userId:id,status:"approved"}
  const getFriend = await Friend.find(query).limit(10).select("FriendId createdAt").sort({createdAt:-1}).lean().populate({
     path:"FriendId",
     select:"_id name profilePicture"
  })
  if(getFriend.length === 0){
    return res.status(404).send("can't find")
  }
  const sendCursor  = getFriend.length > 0 ? getFriend[getFriend.length - 1].createdAt : null;
  return res.status(200).json({friend:getFriend,sendCursor})
}

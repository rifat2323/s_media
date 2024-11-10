import fs from 'node:fs'
import { ExtraReq } from "../../type";
import {Response } from "express";

import { unlink } from "node:fs";
import ImageKit from "imagekit";
import Stories from '../../models/Strories';
import sanitize from 'sanitize-html';

const imagekit = new ImageKit({
    publicKey : process.env.imgKit_Public_key_two as string,
    privateKey : process.env.imgKit_privateKey_two as string,
    urlEndpoint : process.env.imgKit_urlEndpoint_two as string
 
 });


export const postStories = async (req:ExtraReq,res:Response)=>{
    const id = req.userId
    const file = req.file
    const type = file?.mimetype
    const textContent = sanitize(req.body.textContent) || ''
     let mediaURl:string | null = null;
      //checking at last one is there
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
              pre: 'width:700,height:500,quality:80',
              post:[{ 
                 type:"transformation",
                 value:'width:500,height:700,quality:70'
              }]
           }
           
          
            
            
          })
         
         mediaURl = s.url
        
             
             unlink(file?.path,(error)=>{
               console.log(error)
             })
        
          
         
        
     }

  
 const newStories = await Stories.create({
    userId:id,
    mediaUrl:mediaURl,
    textContent:textContent
    
 })
return res.status(201).json(newStories)

}

export const getStories = async (req:ExtraReq,res:Response)=>{
   const storiesId =req.query.storiesId !== "null" ? sanitize(req.query.storiesId as string) : null
   const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
   let userStories;
   if(storiesId){
      userStories = await Stories.findById(storiesId).populate({
         path:"userId",
         select:"_id name profilePicture"
      }).lean()
     

   }
   
   const query = cursor ? {createdAt:{$lt:cursor}}:{}

 const getRandom = await Stories.find(query).sort({createdAt:-1}).limit(10).lean().populate({
    path:"userId",
    select:"_id name profilePicture"
 })
 if(getRandom.length === 0){
   return res.status(400).send("no stories found")
 }

const sendCursor  = getRandom.length > 0 ? getRandom[getRandom.length - 1].createdAt : null
return res.status(200).json({stories:[userStories,...getRandom],sendCursor})
}


export const whoPostStory = async (req:ExtraReq,res:Response)=>{
   const {user_friend} = req.body
   const  cursor = req.query.cursor !== "null" ? req.query.cursor as string : null

   const friendIds = Array.isArray(user_friend) && user_friend.length > 0
   ? user_friend.map(friend =>  sanitize(friend.FriendId))
   : [];
   const query = cursor ? {userId:{$in:friendIds},createdAt:{$lt:cursor}}:{userId:{$in:friendIds}}
   const findAll = await Stories.find(query).select("userId createdAt _id").sort({createdAt:-1}).populate({
      path:"userId",
      select:"_id name profilePicture"
   }).limit(20).lean()
  const sendCursor  = findAll.length > 0 ? findAll[findAll.length - 1].createdAt : null
 return res.status(200).json({friends:findAll,sendCursor:sendCursor})
}





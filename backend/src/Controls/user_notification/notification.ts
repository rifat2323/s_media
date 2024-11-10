
import { Response } from "express";
import { ExtraReq } from "../../type";
import Notification from "../../models/Notification";
import sanitize from "sanitize-html";
import User from "../../models/User";



export const getNotification = async (req:ExtraReq,res:Response)=>{

    const id = req.userId
    const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
   const qury = cursor ? {posterId:id,createdAt:{$lt:cursor}}:{posterId:id}
    const notification = await Notification.find(qury).limit(20).sort({createdAt:-1}).lean()

    const sendCursor = notification.length > 0 ? notification[notification.length - 1].createdAt : null
    return res.status(200).json({notification,sendCursor})
}
export const getUserNotification = async (req:ExtraReq,res:Response)=>{

   const userId = sanitize(req.query.userId as string) 

  const findUser = User.findOne({_id:userId}).select(" _id name profilePicture createdAt ").lean()
  if(!findUser) return res.status(404).send("User not found")
  
  
  return res.status(200).json(findUser)

}
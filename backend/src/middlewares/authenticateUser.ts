import {  Response,NextFunction } from "express";
import sanitize from "sanitize-html";
import verifyJwt from "../funcation/VerifyJwt";
import { ExtraReq } from "../type";

const authenticateUser = async (req:ExtraReq,res:Response,next:NextFunction)=>{

    try {
        const token = sanitize(req.cookies.access_token);
       

        if (!token) {
            return res.status(401).send("No token found, please login");
        }

        const {data} = verifyJwt(token, "access_token");
        console.log(data.user_id)
        if (!data || !data.user_id) {
            return res.status(401).send("User not found");
        }

        req.userId = data.user_id;
        req.userName = data.user_name
        req.userImg = data.user_img
        req.friendLimit = data.friend_limit
        return next(); 
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }




}
export default authenticateUser

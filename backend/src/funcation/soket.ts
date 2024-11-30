import { Server,Socket} from "socket.io";

import universelCookie from 'universal-cookie'
import verifyJwt from "./VerifyJwt";
import client from "../db/Radis";
import {send_and_receive_message }from '../Controls/user_message/message'
let io:Server ;



const origin = process.env.ORIGIN ?? "http://localhost:3000"
export const initializeSocket =   (nameServer:any):void => {
 io =new Server(nameServer,{
 cors:{
    origin:origin,
    credentials:true,

 } 
 }) 



 io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    const rawCookie = socket.request.headers.cookie
   
    if(!rawCookie){
        socket.disconnect(true)
        console.log("use disconnect")
        return;
    
    }
    //handel diffarent thing with funcation 
    // import func and set socket for getting cookie in multiple place 
    handelJoin(socket,rawCookie)
    send_and_receive_message(socket,rawCookie,io)
   

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

console.log('Socket  initialized!');
}




const handelJoin = async (soket:Socket,rawCookie:string)=>{
    
    const parseCookie = new universelCookie(rawCookie)
    const refresh_token = parseCookie.get('refresh_token')
    const {data} = verifyJwt(refresh_token, "refresh_token");
    soket.join(data.user_id)

    if (soket.rooms.has(data.user_id)) {
        const user = {
            _id: data.user_id,
            name: data.user_name,
            profilePicture: data.user_img
        }
        try {
            // Save the user information in Redis
            await client.set(data.user_id, JSON.stringify(user));
            console.log(`User information saved in Redis for user: ${data.user_id}`);
        } catch (error) {
            console.error('Error saving user information in Redis:', error);
        }
    } else {
        console.error(`User failed to join room: ${data.user_id}`);
    }
    
    soket.on('disconnect',async () => {
        // Check if the user was in the room before disconnecting
        if (!soket.rooms.has(data.user_id)) {
            await client.del(data.user_id);
            console.log(`User has disconnected from room: ${data.user_id}`);
            
        } else {
            console.error(`User was still in the room at disconnection: ${data.user_id}`);
        }
    });
}




export const getSocket = () => io;


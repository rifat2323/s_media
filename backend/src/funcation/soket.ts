import { Server,Socket} from "socket.io";

import universelCookie from 'universal-cookie'
let io:Server;
let isSocketInitialized = false;


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
        return;
    
    }
    //handel diffarent thing with funcation 
    // import func and set socket for getting cookie in multiple place 
    handelJoin(socket,rawCookie)
   

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
isSocketInitialized = true
console.log('Socket  initialized!');
}




const handelJoin = (soket:Socket,rawCookie:string)=>{
    
    const parseCookie = new universelCookie(rawCookie)
    const refresh_token = parseCookie.get('refresh_token')
    soket.join(refresh_token.user_id)
    
    console.log(refresh_token)
     
}



// this will be call every where for io.emit and io.on for listing and emitting

export const getSocket = () => {
    if(!isSocketInitialized){
      
        return null 
    }
   
    console.log('Socket initialized!');
 
    return io
}



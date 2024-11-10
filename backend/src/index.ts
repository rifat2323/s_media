
import express  from 'express';
import 'dotenv/config'
import { createServer } from 'http';
import morgan from 'morgan'
import cors from 'cors'
import { Request,Response,NextFunction } from 'express';
import cookieParser  from 'cookie-parser'

import connectDB  from './db/Connect'
import mongoose from 'mongoose';
import path = require('path');
import { initializeSocket } from './funcation/soket';
import client from './db/Radis';

// those are the routes
import  PublicUser from './routes/Public/user/user';
import UserPost from './routes/privet/user/Post'
import PublicPost from './routes/Public/post/post'
import SavePost from './routes/privet/user/save_post'
import UserComment from './routes/privet/user/comment'
import UserLike from './routes/privet/user/like'
import UserFriend from './routes/privet/user/friend'
import UserProfile from './routes/privet/user/profile'
import Stroies from './routes/privet/user/stroies'
import UserNotification from './routes/privet/user/Notification'
import Search from './routes/privet/user/Search'
import VisitProfile from './routes/privet/user/visitProfile'
import Message from './routes/privet/user/message'
const port = process.env.PORT ?? 4000
const origin = process.env.ORIGIN ?? "http://localhost:3000"
const app = express()
connectDB()

const server = createServer(app)

app.use(cors({
  credentials:true,
  origin:[origin,"freeimage.host"]
}))
//soket initialize
initializeSocket(server)

app.use(cookieParser())


app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({limit:"10mb",extended:true}))
app.use(morgan("dev"))

app.use("/upload",express.static(path.join(__dirname,"./upload")))


app.get('/set', async (_req:Request,res:Response) => {
 
  const keys = await client.keys('*');
  const values = await Promise.all(keys.map(async (key) => {
    const value = await client.get(key);
    return { key, value: JSON.parse(value!) };
  }));
  console.log('All Redis Data:', values);
  return res.status(200).json(values);
});


//privet folder
app.use('/user_profile',UserProfile)




//public folder
app.use('/user',PublicUser)

//privet folder
app.use('/userpost',UserPost)

//public folder
app.use("/public",PublicPost)
//privet user folder
app.use("/user_save",SavePost)

//privet user folder
app.use("/user_comment",UserComment)

//privet user folder
app.use("/user_like",UserLike)

//privet user folder
app.use("/user_friend",UserFriend)

//privet user folder
app.use("/user_stroies",Stroies)

//privet user folder
app.use("/user_notification",UserNotification)

//privet user folder

app.use("/user_search",Search)
//privet user folder
app.use("/visit_profile",VisitProfile)
//privet user folder
app.use("/message",Message)

app.get('/',(_req:Request,res:Response)=>{
  try{
    res.status(200).send("hello world")

  }catch(error){
    console.log(error)
    res.status(500).send(error)
  }

})



app.use((err:Error, _req:Request, res:Response, _next:NextFunction) => {
  console.error(err); // Logs the error for debugging
  res.status(500).json({ message: 'Internal Server Error',error:err });
});

mongoose.connection.once("open"  , async()=>{
  console.log("mongodb connected")
  /* const indexes = await mongoose?.connection?.db?.collection('users').indexes(); 
  console.log(indexes); */
  server.listen(port,()=>{
    console.log(`listing on port ${port}`)
  })

})

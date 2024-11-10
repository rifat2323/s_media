
import Post from "../../models/Post";
import { Request,Response } from "express"
import sanitize from "sanitize-html";


import { unlink } from "node:fs";
import ImageKit from "imagekit";
import fs from 'node:fs'
import { getPostSchema } from "../../JoiType";
import { ExtraReq } from "../../type";
import LikeCommentSchema from "../../models/CountLike";
import Like from "../../models/Like";



//?have to change user id here here 

//? we should get it from token

const imagekit = new ImageKit({
   publicKey : process.env.imgKit_Public_key as string,
   privateKey : process.env.imgKit_privateKey as string,
   urlEndpoint : process.env.imgKit_urlEndpoint as string

});
//?have to add user id from req.id from middleware later
export const createPost = async (req:ExtraReq,res:Response)=>{
   const id = req.userId

    // const userId = sanitize(req.body.userId)
     const textContent = sanitize(req.body.textContent)

      const file = req.file
     const type = file?.mimetype
     let mediaURl:string | null = null;
     let fileId:string | null = null
      //checking at last one is there
      if(!textContent && !file){
        return res.status(400).send("at least one field is required")
      }
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
               pre: 'width:500,height:500,quality:60',
               post:[{ 
                  type:"transformation",
                  value:'width:400,height:400,quality:50'
               }]
            }
            
           
             
             
           })
          
          mediaURl = s.url
         fileId = s.fileId
              
              unlink(file?.path,(error)=>{
                console.log(error)
              })
         
           
          
         
      }
     
        

     const newPost  = await Post.create({
       
        textContent:textContent,
        mediaUrl:mediaURl,
        userId:id,
        fileId:fileId
     })
     
    await LikeCommentSchema.create({
      postId:newPost._id,
      posterId:id
      
   })
   
     return res.status(201).json(newPost)

}


/* export const getPostBody = async (req:Request,res:Response)=>{
    const {error,value} = getPostSchema.validate(req.body)
    console.log(req.body.friend)
   
     
    const cursor =  req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
      const random_cursor = req.query.random_cursor !== "null" ?  sanitize(req.query.random_cursor as string) : null;
     
    if(error){
      return res.status(400).send(error?.message)
    }
   const sanitizeArray = value?.friend?.map((item:{FriendId:string})=>sanitize(item.FriendId)) || []

   const query = cursor 
   ? { posterId: { $in: sanitizeArray }, createdAt: { $lt: cursor } } 
   : { posterId: { $in: sanitizeArray } };
   const query_random = random_cursor ? {
      createdAt: { $lt: random_cursor }
   }:{}

 const [post,randomPost] = await Promise.all([
   LikeCommentSchema.find(query).limit(2).sort({createdAt:-1}).lean().populate({
      path:"postId",
      populate:{
         path:"userId",
         select:"_id name profilePicture"
      }
      
   }),
   LikeCommentSchema.find(query_random).limit(10).sort({createdAt:-1}).lean().populate({
      path:"postId",
      populate:{
         path:"userId",
         select:"_id name profilePicture"
      }
      
   })

 ])

 const friendCoursor = post.length > 0 ? post[post.length - 1].createdAt : null;
  const randomCoursor = randomPost.length > 0 ? randomPost[randomPost.length - 1].createdAt : null;
 const margePost  = [...post,...randomPost]
 if(margePost.length === 0){
   return res.status(400).send("no more post found")
 }
 return res.status(200).json({
   posts:margePost,
   cursor:friendCoursor,
   random_cursor:randomCoursor
 })
} */
 export const getPostBody = async (req: ExtraReq, res: Response) => {
   const userId = req.userId 
   const { error, value } = getPostSchema.validate(req.body);
 
   if (error) {
     return res.status(400).send(error?.message);
   }
 
   const cursor = req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null;
   const random_cursor = req.query.random_cursor !== "null" ? sanitize(req.query.random_cursor as string) : null;
   const sanitizeArray = value?.friend?.map((item: { FriendId: string }) => sanitize(item.FriendId)) || [];
 
   const query = cursor
     ? { posterId: { $in: sanitizeArray }, createdAt: { $lt: cursor } }
     : { posterId: { $in: sanitizeArray } };
 
   const query_random = random_cursor ? { createdAt: { $lt: random_cursor } } : {};
 
   // Retrieve posts and random posts concurrently
   const [posts, randomPosts] = await Promise.all([
     LikeCommentSchema.find(query).limit(2).sort({ createdAt: -1 }).lean().populate({
       path: "postId",
       populate: {
         path: "userId",
         select: "_id name profilePicture",
       },
     }),
     LikeCommentSchema.find(query_random).limit(10).sort({ createdAt: -1 }).lean().populate({
       path: "postId",
       populate: {
         path: "userId",
         select: "_id name profilePicture",
       },
     }),
   ]);
 
   // Get all post IDs to check if the user has liked any of them
   const postIds = [...posts, ...randomPosts].map(post => post.postId._id);
   const userLikes = await Like.find({ postId: { $in: postIds }, userId }).lean();
   const likedPostIds = new Set(userLikes.map(like => like.postId.toString()));
 
   // Add `isLiked` field to each post
   const postsWithIsLiked = posts.map(post => ({
     ...post,
     isLiked: likedPostIds.has(post.postId._id.toString()),
   }));
 
   const randomPostsWithIsLiked = randomPosts.map(post => ({
     ...post,
     isLiked: likedPostIds.has(post.postId._id.toString()),
   }));
 
   const friendCursor = postsWithIsLiked.length > 0 ? postsWithIsLiked[postsWithIsLiked.length - 1].createdAt : null;
   const randomCursor = randomPostsWithIsLiked.length > 0 ? randomPostsWithIsLiked[randomPostsWithIsLiked.length - 1].createdAt : null;
 
   const uniquePostsMap = new Map<string, any>();
  [...postsWithIsLiked, ...randomPostsWithIsLiked].forEach(post => {
    uniquePostsMap.set(post.postId._id.toString(), post);
  });

  const uniquePosts = Array.from(uniquePostsMap.values());

   if (uniquePosts.length === 0) {
     return res.status(400).send("no more posts found");
   }
 
   return res.status(200).json({
     posts: uniquePosts,
     cursor: friendCursor,
     random_cursor: randomCursor,
   });
 };
 
export const getPost = async (req:Request,res:Response)=>{
    
     
      
const random_cursor = sanitize(req.query.cursor as string) || null;
     
  
   


   const query_random = random_cursor ? {
      createdAt: { $lt: random_cursor }
   }:{}

 const [post] = await Promise.all([
 
   Post.find(query_random).limit(12).sort({createdAt:-1}).lean().populate({
      path:"userId",
      select: "_id name profilePicture"
   })

 ])
 const random_cursors = post.length > 0 ? post[post.length - 1].createdAt : null;

 return res.status(200).json({
   posts:post,
   random_cursor:random_cursors,
  
 })
}

export const deletePost = async (req:ExtraReq,res:Response)=>{
   const id = req.userId
   const postId = sanitize(req.query.post_id as string)
   if(!postId){
      return res.status(404).send("a  postId is required")
   }


   const deletePost  =  await Post.findOneAndDelete({userId:id,_id:postId}).lean()
   
   if(!deletePost){
      return res.status(404).send("post not found")
   }
   if(deletePost.fileId){
     await imagekit.deleteFile(deletePost.fileId)

   }
 
  return res.status(200).send({deleted:true})



}










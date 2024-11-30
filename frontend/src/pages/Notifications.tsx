import React, { useEffect, useState,useContext } from 'react'
import NotificationChunks from '@/components/Notification/NotificationChunks'
import fetch_get_data from '@/utils/fecthing/GetData';
import FriendRequestCunks from '@/components/Notification/FriendRequestCunks';
import { CardContext } from '@/context/CardCOntext';
import { useInView } from 'react-intersection-observer';

interface data {
  commenterId: string;
  commenterImg?: string;
  commenterName?: string;
  createdAt: string;
  postId?: string;
  posterId: string;
  type: string;
  updatedAt: string; // or Date if parsing
  __v: number;
  _id: string;
}
const Notifications = () => {
  const [data,setData] = useState<data[] | []>([])
  const [coursor,setCoursor] = useState<string >('')
  const {ref,inView} = useInView({threshold:0.1})
  const {Socket} = useContext(CardContext)
  useEffect(()=>{
    const getData =  async()=>{
      const {error,response} = await fetch_get_data(`user_notification/get_notification?cursor=${coursor} `)
      if(error || !response){
        console.log(error)
        return
      }
      setData(response.data.notification)
      setCoursor(response.data.sendCursor)

    }
    getData()

  },[])


  useEffect(()=>{
    if(!Socket || !inView) return
    Socket.on('new_notification',(notification)=>{
      setData((prev)=>[notification,...prev])
      console.log(notification)
    })
   return()=>{
    console.log("unmount")
    Socket.off('new_notification')
   }
  },[inView])
    
  return (
    <div  ref={ref} className="max-w-md mx-auto bg-white  rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
    {/* Render Notification Components */}
    {data.map((notification, index) => {
      const message = notification.type === "f_request" ? "Someone send Friend Request" : notification.type === "liked" ? " Liked Your post" : "comment on Your post" 
       
    
    return(
      notification.type !== "f_request" ? (
        <NotificationChunks
        key={index}
        profileImage={notification.commenterImg || "https://placehold.co/60x60"}
        message={message}
        time={notification.createdAt}
        userName={notification.commenterName || "placeholder User"}
        type={notification.type}
        postId ={notification.postId || "00000"}
      />
        
      ):(
        <FriendRequestCunks senderId={notification.commenterId}/>
      )
       
      
      
     
    )})}
  </div>
  )
}

export default Notifications
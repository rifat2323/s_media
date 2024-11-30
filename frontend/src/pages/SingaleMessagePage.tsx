

import { useEffect, useRef, useState,useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Send, Phone, Video, MoreVertical } from 'lucide-react'
import fetch_get_data from '@/utils/fecthing/GetData'
import { useParams } from 'react-router-dom'
import {formatDistance} from 'date-fns'
import { CardContext } from '@/context/CardCOntext'
import { useInView } from "react-intersection-observer";
import { throttle } from 'throttle-debounce'


interface Message { 
  sender:string,
  receiver:string,
  Message:string
 createdAt:Date;
 sendTime:Date
 _id:string
}


type userData = {
  _id:string,
  name:string,
  profilePicture:string
}

export default function SingleMessagePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userData,setUserData] = useState<userData | null>(null)
  const [isActive,setIsactive] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const [cursor,setCursor] = useState<string | null>(null)
  const [room,setRoom] = useState<string>('')
  const [loading,setLoading] = useState(false)
  

  const { ref, inView } = useInView({
    threshold: 0.1, 
  });
  const {id} = useParams()
   

   

   useEffect(()=>{
    const getUserData =async ()=>{
      const {error,response} = await fetch_get_data(`message/get_friend_status?friendId=${id}`)
      if(error || !response)return
      setIsactive(response.data.isActive)
      setUserData(response.data.user)
     

    }
    getUserData()

   },[])

   const getData = async ()=>{
    if(loading) return
    setLoading(true)
    const {error,response} = await fetch_get_data(`message/get_message?friendId=${id}&cursor=${cursor}`)
    if(error || !response)return
    setCursor(response.data.sendCursor)
    setMessages((prev)=>[...prev,...response.data.messages])
    setLoading(false)
    
  }

   useEffect(()=>{
    if(!inView ) return
    getData()
    
   },[inView])


 const {Socket} = useContext(CardContext)
 useEffect(()=>{
  if(!Socket || !inView) return
  Socket.emit("joinRoom",id)
  Socket.on("joinedRoom",(roomId:string)=>{
    
    setRoom(roomId)
   
     
  })
  Socket.on("receive_message",(data:Message)=>{
   
    setMessages((prev)=>[data,...prev])
  
  })
  
   const handelBeforeUnload = ()=>{
    Socket.emit("leaveRoom", id);
    Socket.off("receive_message");

   }
   window.addEventListener("beforeunload", handelBeforeUnload);

  return () => {
  
      console.log("Leaving room due to component unmount or route change");
    Socket.emit("leaveRoom", id);
    Socket.off("receive_message");
    window.removeEventListener("beforeunload", handelBeforeUnload);

    
    
  };

 },[inView])
 
 
 console.log(messages.length)

 
 
 const handleSendMessage = () => {
  Socket?.emit("send_message",{
    FriedId:id,
    Message:newMessage,
    room:room
  })
  setNewMessage('')
}
const loadMore = ()=>{
  getData()
}
 //call api based on viw from here check the index and current active index
  return (
    <div ref={ref} className="flex flex-col h-screen w-full mx-auto bg-white  overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarImage src={userData?.profilePicture ||"/placeholder.svg?height=40&width=40"} alt="Friend's name" />
            <AvatarFallback>{userData?.name}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold">{userData?.name}</h1>
            <p className="text-xs">{isActive ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
            <Video onClick={loadMore} className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-200">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
   
        <div ref={scrollAreaRef} className=' px-1 py-2 h-[75dvh] overflow-y-auto flex  flex-col-reverse gap-1   w-full'>

     
        {messages.map((message) => (
          <div
            key={message._id+Math.random()}
            className={`flex w-full  ${message.sender === id ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.Message}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                {formatDistance(new Date(message.sendTime),new Date(),{addSuffix:true})}
              </p>
            </div>
          </div>
        ))}
        {
          messages.length ===0 &&(
            <div className='text-center text-gray-800  text-xl'>start conversation</div>
          )
        }
           </div>
   

      {/* Message Input */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 ">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
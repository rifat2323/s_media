
import {  Check, Plus, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import fetch_get_data from '@/utils/fecthing/GetData';
import { useToast } from "@/hooks/use-toast"
import {  useState } from 'react';


type people= {
    name: string;
    _id:string
    profilePicture: string;
}
const FriedSuggAv = ({person}:{person:people}) => {
  const [isFriend,setIsFriend] = useState(false)
    const [ref, inView] = useInView({
        threshold:0.5
    })

    
    const {toast} = useToast()

   
    const SendFriendRequest = async ()=>{
      const {response,error} = await fetch_get_data(`user_friend/send_friend_request?friendId=${person._id}`)
       if(response?.status ===200){
        toast({
          title:"Friend Request Sent"
        })
        setIsFriend(true)
       }else{
        toast({
          title:error?.response.data
        })
       }
      
      console.log(error)

    }
  return (
    <li  className={cn("flex items-center w-full justify-between mb-3",{
        "h-[45px]":!inView
    })} ref={ref}>
    <div   className="flex items-center justify-center gap-1">
      
      <Avatar    className={cn(' w-8 h-8  ',{
        "hidden":!inView
      })} >
      <AvatarImage  src={person.profilePicture || "https://placehold.co/60x60"} />
      <AvatarFallback>{person.name}</AvatarFallback>
      
    </Avatar>
      <div className={cn(' flex flex-col items-start justify-center',{
        "hidden":!inView
      })}>
        <p className="font-medium">{person.name}</p>
        
      </div>
    </div>

    <button className={cn("flex items-center text-blue-500 hover:text-blue-700",{
        "hidden":!inView
      
    })}>
      {
        isFriend ?(
          <Check  size={20}/>

        ):(
          <Plus onClick={SendFriendRequest} size={20} />
        )
      }
     

     
  
    </button>
  </li>
  )
}

export default FriedSuggAv
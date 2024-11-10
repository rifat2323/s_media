
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { cn } from "@/lib/utils";
import { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

type data = {
  _id:string,
  userId:{
    name:string,
    _id:string,
    profilePicture:string
  },
  createdAt:string
}
const StoriesImg = ({item,index,setActiveIndex}:{item:data,index:number,setActiveIndex: React.Dispatch<React.SetStateAction<number>>}) => {
    const [ref, inView] = useInView({
        threshold:.1,
    
      });
      useEffect(()=>{
        if(inView){
          setActiveIndex(index)

        }
        

      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[inView])

    const navigate = useNavigate()
  return (
    <Avatar onClick={()=>{
      navigate(`/stories?id=${item._id}`)
    }}   ref={ref}  className={cn(' w-14 h-14 ring-2  ring-offset-4 ring-pink-500 ')} >
    <AvatarImage  src={ item.userId.profilePicture||"https://github.com/shadcn.png"} className={cn('',{
        "hidden":!inView
    })} />
    <AvatarFallback>CN</AvatarFallback>
    
  </Avatar>
  )
}

export default StoriesImg
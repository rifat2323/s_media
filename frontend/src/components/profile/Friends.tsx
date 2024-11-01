

import { useEffect, useState } from "react"
import EachFriend from "./EachFriend"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useInView } from "react-intersection-observer"




type Data = {
    FriendId:{
        name:string,
    profilePicture:string,
    _id:string

    }
    
    createdAt:Date,
    _id:string
}[]
export default function ImprovedColorfulFriendsList({shouldFetch}:{shouldFetch:boolean}) {
    const[loading,setLoading] = useState(false)
    const [data,setData] = useState<Data | []>([])
    const [coursor,setCoursor] = useState<string >('')

    const [useInRef, inView] = useInView({
        threshold:0,
        
    
      });
      console.log(data)
 useEffect(()=>{
    const getData = async ()=>{
        if (loading || !inView || !shouldFetch) return;
     const {response,error} = await fetch_get_data(`user_profile/get_user_friend?cursor=${coursor}`)
     if(error || !response) {
        setLoading(false)
        return

     }
     setData((prev)=>[...prev,...response.data.friend])
     setCoursor(response.data.sendCursor)
    
    }

    getData()

 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[inView,shouldFetch,loading])


  return (
    <div ref={useInRef} className="p-4  rounded-xl">
      <ul className=" flex justify-center items-center gap-2 flex-col">
        {data.map((friend) => (
         <EachFriend data={friend} key={friend._id}/>
        ))}
      </ul>
    </div>
  )
}
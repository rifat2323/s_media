

import { useEffect, useState } from "react"
import EachFriend from "./EachFriend"

import { useInView } from "react-intersection-observer"
import { useProfile } from "@/zustan/Profile"
import { useToast } from "@/hooks/use-toast"




export default function ImprovedColorfulFriendsList({shouldFetch}:{shouldFetch:boolean}) {
 /*    const[loading,setLoading] = useState(false)
    const [data,setData] = useState<Data | []>([])
    const [coursor,setCoursor] = useState<string >('') */

    const [useInRef, inView] = useInView({
        threshold:0,
        
    
      });
  

      const Friend = useProfile((state)=>state.friends)
      const {getMoreFriend} = useProfile((state)=>state)
      const {cursor} = useProfile((state)=>state)
      const {noMoreFriend} = useProfile((state)=>state)

      useEffect(()=>{
        if(!shouldFetch || !inView || noMoreFriend) return
        getMoreFriend(cursor)


      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[shouldFetch,inView])
     
/*  useEffect(()=>{
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
 },[inView,shouldFetch,loading]) */

 /*  if(noMoreFriend){
    toast({
      title:"no more friends"
    })
  } */

  return (
    <div ref={useInRef} className="p-4  rounded-xl">
      <ul className=" flex justify-center items-center gap-2 flex-col">
        {Friend && Friend.map((friend) => (
         <EachFriend data={friend} key={friend._id}/>
        ))}
      </ul>
      {
        noMoreFriend &&(
          <div className=' text-lg text-gray-950 text-center mt-4'>no more friends</div>
        )
      }
    </div>
  )
}
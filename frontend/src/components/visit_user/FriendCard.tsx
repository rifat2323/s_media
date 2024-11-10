import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useToast } from "@/hooks/use-toast"
import { useVisitProfile } from "@/zustan/visit_profile"


interface Friend {
    FriendId:{
        _id: string
        name: string
        profilePicture: string

    },
    createdAt:Date,
    _id:string
 
}



export default function FriendCards({id}:{id:string}) {
   /*  const [data,setData] = useState<Friend[] | []>([])
    const [cursor,setCursor] = useState('')
    const[loading,setLoading] = useState(false)
  
     const [count,setCount] = useState(0)
     const [end,setEnd] = useState(false)
    const [useInRef, inView] = useInView({
        threshold:0,
        
    
      });
      const {toast} = useToast()

    useEffect(()=>{
        const getData = async ()=>{
           if (loading || !inView  ) return;
          
   
          setLoading(true)
   
           const {response,error} = await fetch_get_data(`visit_profile/visit_user_friend?userId=${id}&cursor=${cursor}`)
          
           if(error || !response){
               setLoading(false)
               if(error.status === 400){
                   setEnd(true)
                   toast({
                       title:"No more Friends"
                   })
                   return
               }
               return
   
           }
           console.log(response)
           setData((prev)=>[...prev,...response.data.post])
           setCursor(response.data.sendCursor)
           setLoading(false)
        }
        getData()
       // eslint-disable-next-line react-hooks/exhaustive-deps
       },[inView,count,end,id]) */
    const {Friend,noMoreFriend,loading_friend,cursor_friend,getRefreshData,getFriendList} = useVisitProfile((sate)=>sate)
  return (
    <div  className="container mx-auto px-4 py-8 flex flex-col justify-center items-center">
      
      <div className=" flex justify-center items-center gap-2 flex-wrap">
        {Friend.map((friend) => (
          <Card key={friend._id} className="overflow-hidden w-full sm:w-40 h-52">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={friend.FriendId.profilePicture || "https://placehold.co/96x96"} className=" w-24 h-24 object-center" alt={friend.FriendId.name} />
                  <AvatarFallback>{ friend.FriendId.name.length > 10 ? friend.FriendId.name.slice(0, 10) + "..." : friend.FriendId.name}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-2 text-center">{friend.FriendId.name.length > 15 ? friend.FriendId.name.slice(0, 10) + "..." : friend.FriendId.name}</h3>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = `/visit_profile/${friend.FriendId._id}`
                    getRefreshData(friend.FriendId._id)
                  }}
                >
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {
        Friend.length >=10 && !loading_friend && !noMoreFriend &&(
            <Button onClick={()=>getFriendList(id,cursor_friend)} className=" mx-auto bg-blue-500 text-white hover:bg-blue-600 mt-5">Load more</Button>
        )
      }
     
    </div>
  )
}
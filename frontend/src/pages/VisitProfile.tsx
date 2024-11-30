import { useEffect,  useState } from "react"
import { Button } from "@/components/ui/button"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, UserMinus, User, Users } from "lucide-react"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useParams } from "react-router-dom"
import Post from "@/components/visit_user/post"
import FriendCards from "@/components/visit_user/FriendCard"
import { toast } from "@/hooks/use-toast"
import { useVisitProfile } from "@/zustan/visit_profile"

type data = {
    CoverPhoto:string,
    createdAt:Date,
    name:string,
    profilePicture:string,
    _id:string,
    bio?:string

}

export default function ProfilePage() {
  const [isFriend, setIsFriend] = useState(false)
  const [user, setUser] = useState<data|null>(null)

 const {id} = useParams()


 useEffect(()=>{
    const getData = async ()=>{
        const {error,response} = await fetch_get_data(`visit_profile/visit_user?userId=${id}`)
       
        if(error ||  !response){
            console.log(error)
            return
        }
        setUser(response.data)
    }
    getData()

 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
 useEffect(()=>{
  const getData = async ()=>{
    const {error,response} = await fetch_get_data(`user_friend/is_my_friend?friendId=${id}`)
   
    if(error ||  !response){
        console.log(error)
        return
    }
    setIsFriend(response.data.isFriend)
}
getData()
  
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
 const handelReq = async (id:string)=>{
  if(!isFriend){
    const {response,error} = await fetch_get_data(`user_friend/send_friend_request?friendId=${id}`)
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

  }else{

    const {error,response} = await fetch_get_data(`user_friend/remove_friend?friendId=${id}`)
    if(error || !response){
      console.log(error)
      toast({
        title:error?.response?.data
      })
      return
    }
    if(response.status === 200){
      toast({
        title:"Unfriended"
      })
      setIsFriend(false)
    }

  }
  
  
  

}
  const {previousFriendId,getInitialFriendData} = useVisitProfile((sate)=>sate)
 
  return (
    <div  className="max-w-4xl mx-auto min-h-dvh overflow-x-auto  mb-5">
      <div className="relative">
        <img
          src={ user?.CoverPhoto||"/placeholder.svg?height=350&width=1000"}
          alt="Cover"
          className="w-full h-64 object-cover rounded-b-lg"
        />
        <div className="absolute -bottom-16 left-8">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage src={ user?.profilePicture||"/placeholder.svg?height=128&width=128"} alt="Profile" />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-500">{user?.bio || "Bio unavailable"}</p>
          </div>
          <Button
            
            variant={isFriend ? "destructive" : "default"}
            className="flex items-center"
            onClick={()=>handelReq(id!)}
          >
            {isFriend ? (
              <>
                <UserMinus className="mr-2 h-4 w-4" /> Unfriend
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Add Friend
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="posts" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Posts
            </TabsTrigger>
            <TabsTrigger onMouseEnter={()=>getInitialFriendData(id!,previousFriendId)} value="friends" className="flex items-center">
              <Users className="mr-2 h-4 w-4" /> Friends
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
           <Post id={id!} />
          </TabsContent>
          <TabsContent value="friends">
           <FriendCards id={id!}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
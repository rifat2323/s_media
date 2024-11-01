import  { useLayoutEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns';
import { Button } from '../ui/button';
import fetch_get_data from '@/utils/fecthing/GetData';
import { useToast } from '@/hooks/use-toast';
const colors = [
    "bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100",
    "bg-pink-100", "bg-indigo-100", "bg-teal-100", "bg-orange-100", "bg-cyan-100"
  ]


  type data=  {
    FriendId:{
        name:string,
    profilePicture:string,
    _id:string

    }
    
    createdAt:Date,
    _id:string
}

const EachFriend = ({data}:{data:data}) => {
    const [coloredFriends, setColoredFriends] = useState(0)
    const [isUnFriend,setIsUnFriend] = useState(false)

   const {toast} = useToast()

    useLayoutEffect(() => {
        const random = Math.floor(Math.random() * colors.length)
        setColoredFriends(random)
      }, [])
      console.log("userName",data.FriendId.name)
      const handelUnfriend = async () => {
        const {error,response} = await fetch_get_data(`user_friend/remove_friend?friendId=${data.FriendId._id}`)
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
          setIsUnFriend(true)
        }
      }
  return (
    <li
    key={data._id}
    className={`${colors[coloredFriends]} rounded-lg w-full p-4 flex  items-center gap-2 justify-start space-y-3 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-103`}
  >
    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
      <AvatarImage src={data?.FriendId?.profilePicture || "https://placehold.co/200x200" } alt={data.FriendId.name} />
      <AvatarFallback className="text-lg font-semibold">
        {data.FriendId.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <div className=" flex flex-col justify-start items-start gap-1 flex-1 pb-3">
      <h3 className="text-lg font-semibold text-gray-800">{data.FriendId.name}</h3>
      <p className="text-sm text-gray-600">Friend since { format(data.createdAt, 'yyyy-MM')}</p>
    </div>
    <Button disabled={isUnFriend} onClick={handelUnfriend} variant={'destructive'}>Unfriend</Button>

  </li>
  )
}

export default EachFriend
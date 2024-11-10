import  { useEffect, useState } from 'react'
import UserProfile from '../common/UserProfile'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ArrowUpRight } from 'lucide-react';
import Post_Datas from '@/utils/fecthing/postDatas';
import { useToast } from '@/hooks/use-toast';
import { useInView } from 'react-intersection-observer';
type data = {
  value:{
    _id:string,
    name:string,
    profilePicture:string

  }

}[]
const FriendsActive = () => {
  const {toast} = useToast()
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState<data | []>([])
  const [ref,inViw] = useInView({threshold:.1,triggerOnce:true})
  useEffect(()=>{
    const user_friend_data = localStorage.getItem("user_friend")
    const user_friend = JSON.parse(user_friend_data || "[]")
    const getData = async ()=>{
      if(inViw) return
      setLoading(true)
       const {error,response} = await Post_Datas(`message/get_active_friend?index=${1}`,{user_friend})
       if(error || !response){
        toast({
            title:error?.response?.data
        })
        
        
        setLoading(false)
        return
       }
       console.log(response.data)
       setData(response.data)
       setLoading(false)
    }
    getData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[inViw])
  return (
    <div ref={ref} className=' w-full flex flex-col justify-center items-center  py-4'>

        <div className=' w-full flex  justify-between items-center'>

        <h1 className='   text-left font-bold text-lg'>Active Friends</h1>
        <p className=' text-base text-blue-500 font-bold hover:opacity-80 flex justify-center items-center gap-1 cursor-pointer'>Show all<ArrowUpRight className=' stroke-blue-500   transition-all'/></p>
        </div>
     {
      loading && (
        <p className=' text-gray-500 font-sm'>getting your friends...</p>
      )
     }
     {
      data.length === 0 && (
        <p className=' text-gray-500 font-sm'>No active friends</p>
      )

     }
   {
    data.length >0 &&(
      <UserProfile className=' shadow-none border-none'>
      {
    data.map((friend,index)=>(
        <Avatar    className=' w-10 h-10 ring-4  ring-offset-4 ring-green-400 ' key={index}>
        <AvatarImage  src={friend.value.profilePicture||"https://github.com/shadcn.png"} />
        <AvatarFallback>{friend.value.name.charAt(0)}</AvatarFallback>
        
      </Avatar>
    ))
  }

</UserProfile>

    )
   }
  
    </div>
  )
}

export default FriendsActive
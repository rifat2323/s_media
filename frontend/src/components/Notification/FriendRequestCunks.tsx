import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'
import fetch_get_data from '@/utils/fecthing/GetData'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useInView } from 'react-intersection-observer'


type data = {
    _id :string,
    name:string,
    profilePicture:string,
    createdAt:Date
}

const FriendRequestCunks = ({className,senderId}:{className?:string,senderId:string}) => {
    const [data,setData] = useState<data | null >(null)
    const [useInRef, inView] = useInView({
      threshold:0,
      triggerOnce:true
    })

    useEffect(()=>{
        const getData = async ()=>{
          if(!inView) return
            const {error,response} = await fetch_get_data(`user_notification/get_friend_req_notification?userId=${senderId}`)
            if(error || !response){
                console.log(error)
                return
            }
            setData(response.data)


        }
        getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inView])

  return  (
    <div onClick={()=>{window.location.href = `/profile`}}  ref ={useInRef} className={cn("flex items-center p-4 hover:bg-gray-200 rounded-lg cursor-pointer mb-3",className)}>
        {/* Left: Profile Image */}
        <img
          src={data?.profilePicture || "https://placehold.co/60x60"}
          alt="profile"
          className="w-10 h-10 rounded-full mr-4"
        />
        
        {/* Middle: Notification Text */}
        <div className="flex-1">
          <h1 className=" font-semibold text-gray-900">{data?.name}</h1>
          <p className="text-gray-800">
            <span className="font-light text-gray-800">{"send you a friend request"}</span>
          </p>
          {
            data?.createdAt &&(
                <p className="text-sm text-gray-500">{format(new Date(data.createdAt), ' MM/dd/yyyy hh:mm a')}</p>
            )

          }
          
        </div>
  
        {/* Right: Bell Icon */}
        <div className="text-gray-500">
          <Bell className="w-6 h-6  -rotate-12" />
        </div>
      </div>
  )
}

export default FriendRequestCunks
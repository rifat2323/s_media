
import { useEffect, useState } from 'react'
import ComponentReq from './FriendReqSing'
import fetch_get_data from '@/utils/fecthing/GetData'
import { useToast } from '@/hooks/use-toast'
import { useInView } from 'react-intersection-observer'

type friend = {
    FriendId:{
        _id:string
        name:string
        profilePicture:string

    },
    _id:string
   
}[]

const FriendRequest = ({shouldFetch}:{shouldFetch:boolean}) => {
    const [cursor,setCursor] = useState('')
    const [data,setData] = useState<friend | []>([])
    const[loading,setLoading] = useState(false)
    const {toast} = useToast()
    const [useInRef, inView] = useInView({
        threshold:0,
        
    
      });
    useEffect(()=>{
        if (loading || !inView || !shouldFetch) return;
        setLoading(true)
        const fetchData = async ()=>{
            const {error,response} = await fetch_get_data(`user_friend/get_friend_pending_list?cursor=${cursor}`)
            if(error || !response){
                if(error.status === 408){
                    toast({
                        title:"no more friends request"

                    })
                    setLoading(false)
                    return

                }
                toast({
                    title:error?.response?.data
                })
                setLoading(false)
                return
            }
          setData((prev)=>[...prev,...response.data.pendingFriendList])
          setCursor(response.data.sendCursor)
          console.log(response)
          setLoading(false)
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inView,shouldFetch])
  return (
    <div ref={useInRef} className=' w-full h-auto flex flex-col justify-center items-center gap-2'>
        {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
        !loading && data.map(item=>(
            <ComponentReq _id={item.FriendId._id}  image={ item.FriendId.profilePicture ||'https://placehold.co/400x400'} name={item.FriendId.name} key={item._id}/>

        ))
       }
       {
       !loading && data.length ===0 &&(
        <div className='text-center text-xl text-gray-950'>No Friend Request</div>
       )
       }
  
    </div>
  )
}

export default FriendRequest
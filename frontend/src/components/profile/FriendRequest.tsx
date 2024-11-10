
import { useEffect, useState } from 'react'
import ComponentReq from './FriendReqSing'

import { useFriendReq } from '@/zustan/getFriendReq'
import RefreshButton from '../common/RefreshButton'



const FriendRequest = ({shouldFetch}:{shouldFetch:boolean}) => {
   /*  const [cursor,setCursor] = useState('')
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
    },[inView,shouldFetch]) */


    const {Freq,getFriendReq,noMoreReq,loading,cursor,Refresh} = useFriendReq((state)=>state)
    useEffect(()=>{
        if(!shouldFetch || noMoreReq  ) return
        getFriendReq(cursor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[shouldFetch,noMoreReq])
  return (
    <div  className=' w-full h-auto flex flex-col justify-center items-center gap-2'>
        <div className=' w-full flex justify-end'>

       <RefreshButton onClick={()=>{Refresh()}}/>
        </div>
      
       {
        Freq && Freq.map(item=>(
            <ComponentReq _id={item.FriendId._id}  image={ item.FriendId.profilePicture ||'https://placehold.co/400x400'} name={item.FriendId.name} key={item._id}/>

        ))
       }
         {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
       !loading && noMoreReq &&(
        <div className='text-center text-xl text-gray-950'>No More Friend Request</div>
       )
       }
  
    </div>
  )
}

export default FriendRequest
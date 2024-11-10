import React, { useEffect, useState } from 'react'

import fetch_get_data from '@/utils/fecthing/GetData'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

import SocialMediaPostCard from './Simple_Card'
interface SocialMediaPostCardProps {

  mediaUrl: string,
  textContent: string,
  updatedAt: string,
  userId: {
    name
: 
string,
profilePicture
: 
string,
_id
: 
 string
  },
  name: string,
  profilePicture: string,
  _id: string,
  createdAt:Date
};
const Post = ({shouldLoadMore,setShouldLoadMore}:{shouldLoadMore:boolean,setShouldLoadMore: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [data,setData] = useState<SocialMediaPostCardProps[] | []>([])
  const [cursor,setCursor] = useState('')
  const [loading,setLoading] = useState(false)
 

  const {text} = useParams()
  const [useInRef, inView] = useInView({
      threshold:0,
  })

 useEffect(()=>{
  setData([])
 },[text])
  useEffect(() => {
   
      const getData =  async ()=>{
          if(!shouldLoadMore || !inView || loading ) return
         
          setLoading(true)
          setShouldLoadMore(false)
         
       const {error,response} = await fetch_get_data(`user_search/search_post?keyword=${text}&cursor=${cursor}`)
       if(error || !response){
           console.log(error)
           setLoading(false)
           return
       }
       console.log(response.data.post)
       setData((prev)=>[...prev,...response.data.post])
       setCursor(response.data.sendCursor)
       setLoading(false)
      }
      getData()
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ inView, loading, shouldLoadMore])
  return (
    <div ref={useInRef} className=' w-full flex flex-col justify-center items-center gap-2'>
      
    {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>
        )
    }
     {
        !loading && data.length === 0 && (
            <div className=" text-2xl font-semibold text-gray-900">No Result found</div>
        )
    }
    
     {
      data?.map(item=>(
        <SocialMediaPostCard createdAt={item.createdAt} _id={item._id} mediaUrl={item.mediaUrl} textContent={item.textContent} userId={item.userId} key={item._id}/>
      ))
     }
    </div>
  )
}

export default Post
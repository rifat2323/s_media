import  { useEffect, useState } from 'react'

import Post_Datas from '@/utils/fecthing/postDatas'
import { useToast } from '@/hooks/use-toast'
import FriedSuggAv from '../UserRecommend/FriedSuggAv'
import { Button } from '../ui/button'
type people= {
  name: string;
  _id:string
  profilePicture: string;
}[]
const FriendSugg = () => {
    const {toast} = useToast()
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState<people | []>([])
    const [page,setPage] = useState(0)
    const [shouldHiddenButton,setShouldHiddenButton] = useState(false)

  useEffect(()=>{
    const user_friend_data = localStorage.getItem("user_friend")
    const user_friend = JSON.parse(user_friend_data || "[]")
    const getData = async ()=>{
      setLoading(true)
       const {error,response} = await Post_Datas(`user_friend/get_friend_suggestion?page=${page}`,{user_friend})
       if(error || !response){
        toast({
            title:error?.response?.data
        })
        if(error.status === 404){
          setShouldHiddenButton(true)
        }
        
        setLoading(false)
        return
       }
       console.log(response.data)
       setData((prev)=>[...prev,...response.data])
       setLoading(false)
    }
    getData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page])
 
  console.log(data)
  const handleLoadMore = ()=>{
    setPage((prev)=>prev+1)
  }
  return (
    <div className=' w-full h-auto  flex flex-col justify-center items-center py-2'>
        {
        loading && <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'>
          
          </div>
      }
      {
        !loading && data?.map(item=>(
          <FriedSuggAv person={item} key={item._id}/>

        ))
      }
     {
      !shouldHiddenButton &&(
        <Button onClick={handleLoadMore} className=' bg-blue-500 text-white hover:bg-blue-600'>Load More</Button>
      )
     }
  
    </div>
  )
}

export default FriendSugg
import { useEffect, useState } from 'react'
import fetch_get_data from '@/utils/fecthing/GetData'
import HeroCard from '@/components/common/HeroCard'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  }[]
const SavePost = () => {
    const [page,setPage] = useState(0)
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState<Card | []>([])
    const [activeIndex,setActiveIndex] = useState(0)
    const [shoudfetchMore,setShouldFetchMore] = useState(true)
   const {ref,inView} = useInView({
    threshold:0.1,
    triggerOnce:true
    
   })
   const {toast} = useToast()
 
    useEffect(()=>{
        const getData = async ()=>{
            if(loading || !inView) return
            setLoading(true)
            const {error,response} = await fetch_get_data(`user_save/get_save_post?page=${page}`)
            if(error || !response){
                console.log(error)
                toast({
                    title:error?.response?.data
                })
                setLoading(false)
                setShouldFetchMore(false)
                return
            }
            console.log(response.data)
            setData(response.data)
            setLoading(false)
        }
        getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inView,page])
  
  return (
    <div ref={ref} className=' w-full flex flex-col justify-start items-center py-7 h-dvh overflow-y-auto scrollbar-hide'>
        <h1 className=' mb-5 text-xl md:text-4xl text-gray-900 font-bold'>All Your Saved Post Here</h1>
      
        {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
       !loading && data.length ===0 && (
            <div className=' text-lg text-gray-950'>No saved Post.</div>
        )
       }
       <div className=' flex flex-col justify-center items-center gap-2 mb-2'>

    
       {
        !loading && data.map((item,index)=>(
            <HeroCard index={index} imgUrl={item.postId.mediaUrl as string} item={item} key={item._id+Math.random()} setActiveIndex={setActiveIndex} activeIndex={activeIndex}/>
        ))
       }
         </div>
         {
            shoudfetchMore &&(
                <Button onClick={()=>setPage((prev)=>prev+1)} className=' bg-blue-500 text-white hover:bg-blue-600'>Load more</Button>
            )
         }
     

    </div>
  )
}

export default SavePost
import { useEffect, useState } from 'react'

import HeroCard from '@/components/common/HeroCard'

import { Button } from '@/components/ui/button'

import { useSavedPost } from '@/zustan/savedPost'
import RefreshButton from '@/components/common/RefreshButton'

const SavePost = () => {
   
    const [activeIndex,setActiveIndex] = useState(0)
 
   const {getMorePost,loading,noMorePost,increasePage,page,post,getInitialData} = useSavedPost((state)=>state)

   useEffect(()=>{
    if(noMorePost || post.length) return
    getInitialData()

   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])
  return (
    <div  className=' w-full flex flex-col justify-start items-center py-7  min-h-screen'>
        <h1 className=' mb-5 text-xl md:text-4xl text-gray-900 font-bold'>All Your Saved Post Here</h1>
       {
        post.length === 0 && !loading && !noMorePost &&(
          <RefreshButton onClick={()=>getInitialData()}/>
        )
       }
        {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       
       <div className=' flex flex-col justify-center items-center gap-2 mb-2'>

    
       {
         post.map((item,index)=>(
            <HeroCard index={index} imgUrl={item.postId.mediaUrl as string} item={item} key={item._id+Math.random()} setActiveIndex={setActiveIndex} activeIndex={activeIndex}/>
        ))
       }
         </div>
         {
            !noMorePost &&(
                <Button onClick={()=>{
                  increasePage()
                  getMorePost(page+1)
                }} className=' bg-blue-500 text-white hover:bg-blue-600'>Load more</Button>
            )
         }
         {
       !loading && noMorePost && (
            <div className=' text-lg text-gray-950'>No More saved Post.</div>
        )
       }
     

    </div>
  )
}

export default SavePost
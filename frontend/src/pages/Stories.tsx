import  { useEffect,  useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CirclePlus } from 'lucide-react';
import StoryAdder from '@/components/stories/StoryAdder';
import fetch_get_data from '@/utils/fecthing/GetData';
import { useContext } from 'react';
import { CardContext } from '@/context/CardCOntext';

import {
    Carousel,
   
    CarouselContent,
   
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import Component from '@/components/stories/Component'
import { Button } from '@/components/ui/button';

  type stoies = {
    mediaUrl:string,
    textContent:string,
    userId:{
      name:string,
      profilePicture:string
    },
    _id:string
  }[] 
const Stories = () => {
  const [isHide,setIshide] = useState(false)
  const [stories,setStories] = useState<stoies | []>([])
  const [cursor,setCursor] = useState<string | null>(null)
  const [loading,setLoading] = useState(false)
  const [activeIndex,setActiveIndex] = useState(0)
    const [seacrhParam]= useSearchParams()
    
   const storiesId = seacrhParam.get("id")
    const filerStory = stories.filter((story) => story && story._id)
    
    const {userInfo} = useContext(CardContext)
 
   useEffect(()=>{
     const getStories = async ()=>{
      

     
      const query = `user_stroies/get_stories?storiesId=${storiesId}&cursor=${cursor}`
      const {error,response} = await fetch_get_data(query)
      if(error || !response){
        console.log(error)
        if(error.status ===401){
          window.location.href = '/login'
        }
        return
      }
      setStories(response.data.stories)
      setCursor(response?.data.sendCursor)
    
   
     }
     
      getStories();
    

   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])
  
   
 const handelFetchMore = async ()=>{
  if(loading) return

  setLoading(true)
  const query = cursor ? `user_stroies/get_stories?cursor=${cursor}`:"user_stroies/get_stories?cursor"
      const {error,response} = await fetch_get_data(query)
      if(error || !response){
        console.log(error)
        setLoading(false)
        return
      }
      setStories((prevStories) => [...prevStories, ...response.data.stories])
      setCursor(response?.data.sendCursor)
      setLoading(false)
 }
 


  return (
    <div className=' mb-20 w-full mx-0 md:px-3 max-h-dvh flex justify-start items-center flex-col gap-4'>
      <div className=' w-full py-3 border-b  flex justify-between items-center px-5'>
        <div>
          logo
        </div>

        <div  onClick={()=>setIshide((prev)=>!prev)} className='relative w-fit h-fit'>
          <button title='add story' className=' relative w-fit h-fit'>

        <CirclePlus size={35} className=' stroke-blue-400 hover:stroke-blue-500 transition-all'/>
         <img src={userInfo.img || "https://placehold.co/60x60"} alt="user" className=' w-14 h-8 opacity-60 aspect-square absolute pointer-events-none top-0 left-0 rounded-[50%] -z-[1]' />
          </button>
          <div style={{display:isHide?'block':'none'}} className=' w-fit h-fit absolute top-6 right-0 z-20'>
               <StoryAdder/>

        </div>
        </div>
       

      </div>
 

    
    <Carousel    className=" w-[250px]  sm:w-[400px]  md:w-[500px] ">
      <CarouselContent >
        {filerStory
    .map((story,index) => (
         <Component setActiveIndex={setActiveIndex} index={index} key={story._id || Math.random()} data= {story}/>
        ))}
      </CarouselContent>
      <CarouselPrevious   />
      <CarouselNext   />
    </Carousel>
    {
      filerStory.length -1 === activeIndex   && (
        <Button onClick={handelFetchMore} className=' mb-3 bg-blue-500 hover:bg-blue-600'>{loading ? "Loading...":"Load more"}</Button>

      )
    }
    
    </div>
  )
}

export default Stories
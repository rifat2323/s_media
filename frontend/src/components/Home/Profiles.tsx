
import { lazy} from 'react';
const StoriesImg = lazy(()=>import('./StoriesImg'))

import { useEffect, useState } from "react";

import UserProfile from '../common/UserProfile';
import { useInView } from "react-intersection-observer";
import { useStory } from '@/zustan/story';


const Profiles = () => {
 
 
  
  const [shouldFetch,setShouldFetch] = useState(true)
  const [activeIndex,setActiveIndex] = useState(0)
 
  const {cursor,getData,story,getMoreData} = useStory((state)=>state)

  const [ref, inView] = useInView({
    threshold:0,
    triggerOnce:true

  });

  useEffect(()=>{
    if(story.length >=10){
      if(story.length -2 === activeIndex ){
        
        setShouldFetch(true)
      }
    }


  },[story,activeIndex])
  useEffect(()=>{
    if(!shouldFetch   ) return
    if(story.length < 19){
     console.log('fetching  not possible')
      return

    }
    getMoreData(cursor)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[shouldFetch])

  useEffect(()=>{
   
    if(story.length) return
      
    getData(cursor)
   
    

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
   console.log('story',inView)
  return (
   <UserProfile  viwRef={ref} >
     {
       story.map((item,index)=>(
          <StoriesImg item={item} setActiveIndex={setActiveIndex} index={index}  key={index}/>
        ))
      }
   </UserProfile>
  )
}

export default Profiles
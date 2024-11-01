import { StepForward } from 'lucide-react';
import { StepBack } from 'lucide-react';
import { cn } from '@/lib/utils';
import {useState, useRef, useEffect} from 'react'


const UserProfile = ({children,className}:{children:React.ReactNode,className?:string}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [scrollPosition,setScrollPosition] = useState(-1)
    const [totalWidth,setTotalWidth] = useState(0)
    const [viwArea,setViwArea] = useState(0)
    
    useEffect(() => {
     const handleScroll = () => {
       if (ref.current) {
         setScrollPosition(ref.current.scrollLeft);
         setTotalWidth(ref.current.scrollWidth);
         setViwArea(ref.current.clientWidth);
       }
     };
   
     const currentRef = ref.current;
     if (currentRef) {
       currentRef.addEventListener("scroll", handleScroll);
     }
   
     // Clean up the event listener when the component unmounts
     return () => {
       if (currentRef) {
         currentRef.removeEventListener("scroll", handleScroll);
       }
     };
   }, []);
       const handelForword = ()=>{
          if(ref.current){
   
            const viwArea = ref.current?.clientWidth
          
            ref.current?.scrollBy({left:viwArea+28,behavior:"smooth"})
            
            
           
           }
       }
       const handelBackword = ()=>{
          if(ref.current){
   
            const viwArea = ref.current?.clientWidth
           
            ref.current?.scrollBy({left: - viwArea,behavior:"smooth"})
           
           }
       }
  return (
    <div  className=' relative w-full h-fit py-3 flex items-center justify-center   '>
     
     
     
    <div onClick={handelBackword} className={cn(' relative translate-x-5 z-10  bg-gray-100 w-8 h-8 shadow-md flex justify-center items-center rounded-[50%] cursor-pointer hover:bg-blue-500 transition-all ',{
      "opacity-0":  scrollPosition <= 0,
      "pointer-events-none":  scrollPosition <= 0
      
    })} >
    <StepBack className=' hover:stroke-white transition-all' />
  </div>

  
 
   
    <div ref={ref} className={cn(' relative px-2 w-fit max-w-fit mx-3 shadow border sm:mx-0 sm:max-w-[550px] rounded-sm gap-5 h-fit py-8   flex justify-start items-center  overflow-x-scroll   scrollbar-hide ',className)}>
   { children}
    </div>
   
   
      <div onClick={handelForword} className={cn(' relative -translate-x-5 z-10  bg-gray-100 w-8 h-8 shadow-md flex justify-center items-center rounded-[50%] cursor-pointer hover:bg-blue-500 transition-all ',{
        "opacity-0":scrollPosition+viwArea >=totalWidth,
        "pointer-events-none": scrollPosition+viwArea >=totalWidth
      })} >
      <StepForward className=' hover:stroke-white transition-all' />
    </div>

    
   
   
   

</div>
  )
}

export default UserProfile
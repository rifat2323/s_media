import {useState} from 'react'
import { useInView } from 'react-intersection-observer'
import ReactPlayer from 'react-player'
import { InView } from 'react-intersection-observer'
import {
   
    CarouselItem,
   
  } from "@/components/ui/carousel"
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import ImageComponent from '../common/Imges';
type stoies = {
  mediaUrl:string,
  textContent:string,
  userId:{
    name:string,
    profilePicture:string
  },
  _id:string
}
const Component = ({data,index,setActiveIndex}:{data:stoies,index:number,setActiveIndex:React.Dispatch<React.SetStateAction<number>>}) => {
    const [path,setPath] = useState('M14,19H18V5H14M6,19H10V5H6V19Z')
    const [playing,setIsplaying] = useState(true)
    const [isMouse,setIsMouse] = useState(false)
    const [ref,inViw] = useInView({
        threshold:0.8
    })
    const handelCLick = ()=>{
        setPath(path === "M8,5.14V19.14L19,12.14L8,5.14Z"?"M14,19H18V5H14M6,19H10V5H6V19Z":"M8,5.14V19.14L19,12.14L8,5.14Z")
        setIsplaying((prev)=>!prev)
    }

    const canPlay = ReactPlayer.canPlay(data?.mediaUrl);
  return (
    <CarouselItem onMouseOver={()=>setIsMouse(true)} onMouseLeave={()=>setIsMouse(false)}  ref={ref} >
    <InView as='div' onChange={(inViw)=>{
      if(inViw){
        setActiveIndex(index)
      }
    }}  className={cn(" border  h-[380px] md:h-[500px] relative ")}>
        <div className='  flex justify-center items-center gap-1 absolute top-0 left-0 z-20'>
        <Avatar    >
     <AvatarImage  src={data.userId.profilePicture || `https://robohash.org/rifat`} />
     <AvatarFallback>{data.userId.name}</AvatarFallback>
                
     </Avatar>
     <p className=' text-md font-semibold  text-white'>{data.userId.name}</p>

        </div>
       
    {
      canPlay ? (
        <ReactPlayer style={{display:inViw?"block":"none"}}  url={data.mediaUrl} playing={inViw && playing?true:false} controls={false} width={"100%"} height={"100%"} volume={0.5}  stopOnUnmount={true}/>
      ):(
        <ImageComponent  src={data.mediaUrl} className=' object-fill max-md:h-[380px]   w-[100%] '/>
        
       
      )
    }
    
   
     {
      canPlay && (
        <div onClick={handelCLick} className='absolute z-10 left-[50%] top-[50%]'>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill='white' style={{opacity:isMouse?"1":"0",transition:"all 300ms"}}   viewBox="0 0 24 24"><title>play</title><path d={path} /></svg>
            </div>
        

      )
     }
   
    </InView>
  </CarouselItem>
  )
}

export default Component
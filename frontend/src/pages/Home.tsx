
import { lazy,Suspense,useEffect,useRef} from "react"
const TopComponent = lazy(()=>import("@/components/Home/TopComponent"))
const Profiles = lazy(()=>import("@/components/Home/Profiles"))
const CardsComponent = lazy(()=>import("@/components/Home/CardsComponent"))
import { throttle } from "throttle-debounce"



type Card = {
  [key: string]: string | boolean | number | Date ;
 
};

const Home = () => {
 
   const ref = useRef<HTMLDivElement | null>(null)




  

  

     

 


 useEffect(()=>{
  if(!ref.current) return
  const element = ref.current
 const handelScroll =throttle( 300,()=>{
 
 
  if(element.scrollTop + element.clientHeight >=element.scrollHeight - 100){
    return
  }
  
 })

  element.addEventListener("scroll",handelScroll)
  return ()=>{
    element.removeEventListener("scroll",handelScroll)
  }

 },[])
  
  return (
    <div ref={ref} className=" scrollbar-hide w-full flex flex-col mt-6 md:max-h-dvh md:overflow-y-scroll ">
     
      <Suspense fallback={<div>Loading...</div>}>

      <TopComponent/>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>

      <Profiles/>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>

      <CardsComponent  />
      </Suspense>
     
    {/* {
      loading ? 
      <div className=" animate-spin h-10 w-10 border-t-4 border-b-4 border-gray-900 rounded-full">

      </div>:null
    } */}

    </div>
  )
}

export default Home
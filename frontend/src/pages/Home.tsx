
import { lazy,Suspense} from "react"
const TopComponent = lazy(()=>import("@/components/Home/TopComponent"))
const Profiles = lazy(()=>import("@/components/Home/Profiles"))
const CardsComponent = lazy(()=>import("@/components/Home/CardsComponent"))





const Home = () => {
 
   




  
  return (
    <div  className="  w-full flex flex-col mt-6 min-h-dvh ">
     
      <Suspense fallback={<div>Loading...</div>}>

      <TopComponent />
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
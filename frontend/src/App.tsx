import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from '@/pages/Home'
import { lazy,Suspense, useState } from 'react'
import { cn } from './lib/utils'
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar/NavBar"
import SmallNavBar from "@/components/NavBar/SmallNavBar"
const UserRec = lazy(()=>import("@/components/UserRecommend/UserRec"))
const FriendsActive = lazy(()=>import("@/components/UserRecommend/FriendsActive"))
const FriendSuggation = lazy(()=>import("@/components/UserRecommend/FriendSuggation"))
const Stories = lazy(()=>import("@/pages/Stories"))
const Friends = lazy(()=>import("@/pages/Friends"))
const Notifications = lazy(()=>import("@/pages/Notifications"))
const UserPage = lazy(()=>import("@/pages/Profile"))
const Registration = lazy(()=>import("@/pages/Regi"))
const Login = lazy(()=>import("@/pages/Login"))
const PopularPost = lazy(()=>import("@/pages/PopularPost"))
const SavePost = lazy(()=>import("@/pages/SavePost"))
const SingalePost = lazy(()=>import("@/pages/SingalePost"))
const SearchPage = lazy(()=>import("@/pages/SearhPage"))
const VisitProfile = lazy(()=>import("@/pages/VisitProfile"))


import { CardProvider } from './context/CardCOntext'
import ExtraContextParent from './context/ExtraContext'


function App() {
 const [pathname,setPathname] = useState(window.location.pathname)




 
  return (
    <div className=' w-full flex-col md:flex-row  justify-start flex md:justify-center gap-2  md:items-start h-dvh'>
     <Toaster/>
      <BrowserRouter>
      <CardProvider>
        <ExtraContextParent>

       

     
      <div className={cn(' hidden md:flex ml-2  md:h-dvh w-full md:w-[20%]  justify-center items-center flex-col',{
        "md:hidden":pathname==='/registration' || pathname==='/login'  ||  pathname.startsWith('/singlePost')
      })}>
        <Suspense fallback={<div>Loading...</div>}>
   <NavBar />
  
        </Suspense>

   </div>
   <div className={cn('md:hidden w-full  h-16 ',{
    "hidden":pathname==='/registration'|| pathname==='/login' ||  pathname.startsWith('/singlePost')
   })}>
    <Suspense fallback={<div>Loading...</div>}>
     <SmallNavBar/>
    </Suspense>
   </div>
        <div className=' w-full md:flex-1'>
      <Routes>

      <Route index element={<Home/>}/>
      <Route path='/stories' element={
        <Suspense fallback={<div>Loading...</div>}>

          <Stories/>
        </Suspense>
    }/>
      <Route path='/friends' element={
        <Suspense fallback={<div>Loading...</div>}>

          <Friends/>
        </Suspense>
    }/>
      <Route path='/singlePost/:postId' element={
        <Suspense fallback={<div>Loading...</div>}>

          <SingalePost/>
        </Suspense>
    }/>
      <Route path='/visit_profile/:id' element={
        <Suspense fallback={<div>Loading...</div>}>

          <VisitProfile/>
        </Suspense>
    }/>
      <Route path='/notifications' element={
        <Suspense fallback={<div>Loading...</div>}>

          <Notifications/>
        </Suspense>
    }/>
      <Route path='/profile' element={
        <Suspense fallback={<div>Loading...</div>}>

          <UserPage/>
        </Suspense>
    }/>
      <Route path='/registration' element={
        <Suspense fallback={<div>Loading...</div>}>

          <Registration/>
        </Suspense>
    }/>
      <Route path='/popular_post' element={
        <Suspense fallback={<div>Loading...</div>}>

          <PopularPost/>
        </Suspense>
    }/>
      <Route path='/login' element={
        <Suspense fallback={<div>Loading...</div>}>

          <Login setPathname={setPathname}/>
        </Suspense>
    }/>
      <Route path='/save_post' element={
        <Suspense fallback={<div>Loading...</div>}>

          <SavePost />
        </Suspense>
    }/>
      <Route path='/search/:text' element={
        <Suspense fallback={<div>Loading...</div>}>

          <SearchPage />
        </Suspense>
    }/>



      </Routes>
        </div>


        <div className={cn(' scrollbar-hide hidden lg:flex w-[30%] overflow-y-auto h-dvh pl-2  flex-col justify-start pt-8 items-center border-l',{
          "lg:hidden":pathname==='/registration'|| pathname==='/login'  ||  pathname.startsWith('/singlePost')
        })}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserRec/>
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <FriendsActive/>
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <FriendSuggation/>
        </Suspense>

        </div>
        </ExtraContextParent>
      
        </CardProvider>
      </BrowserRouter>
   
        
    </div>
  )
}

export default App

/* eslint-disable @typescript-eslint/no-unused-vars */


import { useContext, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Home, Bookmark, Bell, MessageCircle, Menu, Newspaper, TrendingUp, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSavedPost } from "@/zustan/savedPost"
import { usePopularPost } from "@/zustan/popular_post"
import { useChatList } from "@/zustan/Message"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useToast } from "@/hooks/use-toast"
import { useInView } from "react-intersection-observer"
import { CardContext } from "@/context/CardCOntext"




export default function NavbarWithSheet() {
  const {toast} = useToast()
  const navigate = useNavigate()
  const {getInitialData,post_like,noMorePost_like} = usePopularPost((state)=>state)
  const {getInitialData:getSavedPost,noMorePost:noMorePost_save,post:save_post} = useSavedPost((state)=>state)
  const {getInitialData:getChatUiList,isFetchingError,chatList,isInitialDataLoad} = useChatList((state)=>state)
  const [isOpen, setIsOpen] = useState(false)
  const { ref, inView} = useInView({

    threshold: 0,
  });
 useEffect(()=>{
  const getProfileInfo = async ()=>{
    if(!inView) return
    const {response,error} = await fetch_get_data('user_profile/get_profile_info')
    if(response?.status === 200){
      localStorage.setItem('user_info',JSON.stringify(response.data))
    }
    if(error?.status === 401){
      navigate('/login')
    }
  }
  getProfileInfo()
 },[inView, navigate])
 const {userInfo} = useContext(CardContext)

  const handelMessagInter = ()=>{
    if(isFetchingError || chatList.length || isInitialDataLoad) return
   
    getChatUiList()
  }
  const handelPopularPost = ()=>{
    console.log("hovaring popular post icom")
    if(post_like && post_like.length && post_like.length >0 || noMorePost_like) return
      getInitialData("like")
     
  }
  const handelSavedPost = ()=>{
    if(noMorePost_save ||save_post.length ) return
     
    getSavedPost()
  }

  const handelLogOut = async  ()=>{
  const {error,response} = await fetch_get_data('user/logout')
  if(response?.status === 200 && !error){
    window.location.href = "/login"
  
  }else{
    toast({
      title:"you are not login"
    })
  }
  }
  return (
    <nav ref={ref} className="bg-white shadow-md fixed top-0 z-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Z</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItem to="/" icon={<Home className="h-5 w-5" />} text="Home" />
              <NavItem to="/stories" icon={<Newspaper className="h-5 w-5" />} text="Stories" />
              <NavItem handelMouseEnter={handelPopularPost} to="/popular_post" icon={<TrendingUp className="h-5 w-5" />} text="Popular" />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent forceMount>
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <img src={userInfo.img || "https://placehold.co/30x30"} alt="user img" className=" w-5 h-5 rounded-full" />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <SheetNavItem handelMouseEnter={handelMessagInter} to="/message" icon={<MessageCircle className="h-5 w-5" />} text="Messages" />
                  <SheetNavItem handelMouseEnter={handelSavedPost} to="/save_post" icon={<Bookmark className="h-5 w-5" />} text="Saved Posts" />
                  <SheetNavItem to="/notifications" icon={<Bell className="h-5 w-5" />} text="Notifications" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                <SheetTitle className="flex items-center justify-center gap-1">
                    <img src={userInfo.img || "https://placehold.co/30x30"} alt="user img" className=" w-5 h-5 rounded-full" />
                    <p className=" text-gray-950 text-sm">{userInfo.name}</p>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <SheetNavItem to="/" icon={<Home className="h-5 w-5" />} text="Home" />
                  <SheetNavItem to="/stories" icon={<Newspaper className="h-5 w-5" />} text="Stories" />
                  <SheetNavItem handelMouseEnter={handelPopularPost} to="/popular_post" icon={<TrendingUp className="h-5 w-5" />} text="Popular" />
                  <SheetNavItem to="/message" icon={<MessageCircle className="h-5 w-5" />} text="Messages" />
                  <SheetNavItem handelMouseEnter={handelSavedPost} to="/save_post" icon={<Bookmark className="h-5 w-5" />} text="Saved Posts" />
                  <SheetNavItem to="/notifications" icon={<Bell className="h-5 w-5" />} text="Notifications" />
                  <SheetNavItem to="/profile" icon={<User className="h-5 w-5" />} text="Profile" />
                  <Button onClick={handelLogOut} className=" flex justify-center items-center gap-1">Log out <LogOut className="h-5 w-5" /></Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavItem({ to, icon, text,handelMouseEnter }: { to: string; icon: React.ReactNode; text: string,handelMouseEnter?:()=>void }) {
  return (
    <NavLink
    onMouseEnter={handelMouseEnter}
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          isActive
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`
      }
    >
      {icon}
      <span className="ml-2">{text}</span>
    </NavLink>
  )
}

function SheetNavItem({ to, icon, text,handelMouseEnter }: { to: string; icon: React.ReactNode; text: string,handelMouseEnter?:()=>void }) {
    function setIsOpen(_arg0: boolean): void {
        throw new Error("Function not implemented.")
    }

  return (
    <NavLink
     onMouseEnter={handelMouseEnter}
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm ${
          isActive
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-700 hover:bg-gray-100'
        } rounded-md`
      }
      onClick={() => setIsOpen(false)}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </NavLink>
  )
}
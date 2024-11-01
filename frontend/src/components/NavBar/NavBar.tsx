import { useContext } from 'react';
import { House, Save } from 'lucide-react';
import { Logs } from 'lucide-react';

import { Link, NavLink } from "react-router-dom";
import { Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import fetch_get_data from '@/utils/fecthing/GetData';
import { useInView } from "react-intersection-observer";
import styes from './Navbar.module.css'
import { CardContext } from '@/context/CardCOntext';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useEffect } from 'react';
const NavBar = () => {

   const {userInfo} = useContext(CardContext)
  const navigate = useNavigate()

  const { ref, inView} = useInView({

    threshold: 0,
  });


  useEffect(() => {
    if(!inView) return
    const getProfileInfo = async ()=>{
      const {response,error} = await fetch_get_data('user_profile/get_profile_info')
      if(response?.status === 200){
        localStorage.setItem('user_info',JSON.stringify(response.data))
      }
      if(error?.status === 401){
        navigate('/login')
      }
    }
    getProfileInfo()
  },[navigate,inView])
  return (
    <div ref={ref} className='border-r  shadow-sm overflow-x-hidden flex w-full justify-around items-center h-dvh flex-col  ' >
       <TooltipProvider >
    <NavLink to={'/'}   className={({ isActive, isPending }) =>
    `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>


    <TooltipTrigger className=' flex justify-center items-center gap-1' >
    

        <House color='black'/>
        <h4 className=' font-semibold text-base  text-gray-950'>Home</h4>
      
        </TooltipTrigger>
   

    <TooltipContent align='start'>
      <p>Home</p>
    </TooltipContent>
  </Tooltip>
  </NavLink>
 
  <NavLink to={'/stories'}   className={({ isActive, isPending }) =>
     `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger className=' flex justify-center items-center gap-1'>
      <Logs color='black'/>
      <h4 className=' font-semibold text-base  text-gray-950'>Stories</h4>
      </TooltipTrigger>
    <TooltipContent align='start'>
      <p>Stories</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>

  <NavLink to={'/friends'}   className={({ isActive, isPending }) =>
   `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger className=' flex justify-center items-center gap-1'>
      <Mail color='black'/>
      <h4 className=' font-semibold text-base  text-gray-950'>Message</h4>
      </TooltipTrigger>
    <TooltipContent align='start'>
      <p>Friends</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>

  <NavLink to={'/popular_post'}   className={({ isActive, isPending }) =>
   `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger className=' flex justify-center items-center gap-1'>
      <Flame color='black'/>
      <h4 className=' font-semibold text-base  text-gray-950'>Popular Post</h4>
      </TooltipTrigger>
    <TooltipContent align='start'>
      <p>Popular Post</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>


  <NavLink to={'/save_post'}   className={({ isActive, isPending }) =>
   `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger className=' flex justify-center items-center gap-1'>
    <Save color='black' />
      <h4 className=' font-semibold text-base  text-gray-950'>Saved post</h4>
      </TooltipTrigger>
    <TooltipContent align='start'>
      <p>Save post</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>


 
 </TooltipProvider>
 <NavLink to={'/notifications'}   className={({ isActive, isPending }) =>
     `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
    <div className=' relative  flex justify-center items-center gap-1'>

    

    <Bell color='black'/>
    <h4 className=' font-semibold text-base  text-gray-950'>Notifications</h4>
    <Badge variant="destructive" className=' absolute w-2 h-2 -top-1 left-1'>
    .
    </Badge>
    </div>
    </NavLink>

  <Link to={'/profile'} className=' flex w-full justify-start items-center gap-2 '>
  <Avatar>
  <AvatarImage src={userInfo.img||"https://placehold.co/60x60"} />
  <AvatarFallback>{userInfo.name}</AvatarFallback>

</Avatar>
<p className='text-base font-semibold text-gray-950 '>{userInfo.name}</p>
  </Link>

   

    </div>
  )
}

export default NavBar
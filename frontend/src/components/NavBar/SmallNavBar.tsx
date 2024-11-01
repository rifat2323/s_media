
import {  Bell, House } from 'lucide-react';
import { Logs } from 'lucide-react';
import { UsersRound } from 'lucide-react';
import { Link, NavLink } from "react-router-dom";
import styes from './Navbar.module.css'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
const NavBar = () => {
  return (
    <div className='   flex w-full justify-around items-center h-16 border-b  ' >
       <TooltipProvider >
    <NavLink to={'/'}   className={({ isActive, isPending }) =>
    `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>


    <TooltipTrigger >
    

        <House color='black'/>
      
        </TooltipTrigger>
   

    <TooltipContent>
      <p>Home</p>
    </TooltipContent>
  </Tooltip>
  </NavLink>
 
  <NavLink to={'/stories'}   className={({ isActive, isPending }) =>
     `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger><Logs color='black'/></TooltipTrigger>
    <TooltipContent>
      <p>Stories</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>
  <NavLink to={'/friends'}   className={({ isActive, isPending }) =>
   `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
  <Tooltip>
    <TooltipTrigger><UsersRound color='black'/></TooltipTrigger>
    <TooltipContent>
      <p>Friends</p>
    </TooltipContent>
  </Tooltip>

  </NavLink>
 
 </TooltipProvider>
 <NavLink to={'/notifications'}   className={({ isActive, isPending }) =>
     `${styes.general} ${isPending ? styes.pending : isActive ? styes.active : ''}`
  }>
    <div className=' relative inline-block'>

 

    <Bell color='black'/>
    <Badge variant="destructive" className=' absolute w-2 h-2 -top-1 right-1'>
    .
    </Badge>
    </div>
    </NavLink>
    <Link to={'/profile'} className=' flex justify-around items-center '>
  <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

  </Link>
    </div>
  )
}

export default NavBar
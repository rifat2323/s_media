import React from 'react'
import UserProfile from '../common/UserProfile'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ArrowUpRight } from 'lucide-react';

const FriendsActive = () => {
  return (
    <div className=' w-full flex flex-col justify-center items-center  py-4'>

        <div className=' w-full flex  justify-between items-center'>

        <h1 className='   text-left font-bold text-lg'>Active Friends</h1>
        <p className=' text-base text-blue-500 font-bold hover:opacity-80 flex justify-center items-center gap-1 cursor-pointer'>Show all<ArrowUpRight className=' stroke-blue-500   transition-all'/></p>
        </div>

   
    <UserProfile className=' shadow-none border-none'>
          {
        Array.from({length:25}).map((_,index)=>(
            <Avatar    className=' w-10 h-10 ring-4  ring-offset-4 ring-green-400 ' key={index}>
            <AvatarImage  src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
            
          </Avatar>
        ))
      }

    </UserProfile>
    </div>
  )
}

export default FriendsActive
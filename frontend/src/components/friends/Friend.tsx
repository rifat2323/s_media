import { cn } from '@/lib/utils';
import { UserRoundX } from 'lucide-react';
import { Handshake } from 'lucide-react';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
const Friend = ({ name, profileImage }:{name:string,profileImage:string}) => {
    const [isActive,setIsActive] = useState(false)
    const [ref,inView] = useInView({threshold:0})
    return (
      <div ref={ref} onMouseLeave={()=>setIsActive(false)} className={cn("flex items-center w-[250px]  sm:w-[450px] justify-between p-4 hover:bg-gray-200 rounded-lg cursor-pointer",{
        "h-[48px]":!inView
      })}>
        {/* Left: Profile Image and Name */}
        <div className={cn("flex items-center",{
            "hidden":!inView
        })}>
          {/* Profile Image */}
          <img
            src={profileImage}
            alt={name}
            className="w-12 h-12 rounded-full mr-4"
          />
          {/* Friend's Name */}
          <p className="font-bold text-gray-900">{name}</p>
        </div>
  
        {/* Right: Three Dots (Ellipsis Icon) */}
        <div onClick={()=>setIsActive((prev)=>!prev)} className={cn("text-gray-500 relative",{
            "hidden":!inView
        })}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12h.01M12 12h.01M18 12h.01"
            />
          </svg>

          <div className={cn(' bg-white absolute top-4 right-0 rounded-md  w-[200px] p-2 border flex flex-col gap-2 z-10 justify-center items-center',{
            "hidden":!isActive
          })}>

            <div className=' flex w-full  justify-between items-center gap-1  p-2 rounded hover:bg-red-200'>
                <UserRoundX size={20} className=' hover:stroke-red-500 transition-all'/>
                <p className=' text-sm font-semibold text-gray-950'>Unfriend</p>

                </div>

            <div className=' flex w-full  justify-between items-center gap-1  p-2 rounded hover:bg-blue-200'>
                <Handshake size={20} className=' hover:stroke-blue-500 transition-all'/>
                <p className=' text-sm font-semibold text-gray-950'>Best friend</p>

                </div>
        

          </div>
        </div>
      </div>
    );
  };

  export default Friend
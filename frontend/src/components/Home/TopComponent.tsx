
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Suspense, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
const TopComponent = () => {
    //?have to add search fn and add new post fn later use new from component here please. or get it from shadcn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Menu,setMenu] = useState<React.ComponentType<any> | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const handelMenuClick = async ()=>{
   
    if (!Menu) {
      
      const { default: CardMenu } = await import('@/components/Home/PostSeaction');
      setMenu(() => CardMenu);
    }
    setIsMenuVisible((prev) => !prev);
  }
  const ref = useRef<HTMLInputElement | null>(null);
  const naigate = useNavigate()
  return (
    <div  className={cn(' sm:ml-3 h-fit  w-full gap-4 sm:gap-2 md:gap-0 flex justify-center sm:justify-between  items-center flex-wrap border-b py-2 ')}>
        <Helmet >
            <title>Search anything on Rifat-Book</title>
            <meta property="og:title" content="Search your thing here"/>

        </Helmet>
        <div className={ cn(' flex-1 md:basis-1/3 md:flex-none flex justify-center h-12 items-center border rounded-2xl px-4')}>
            <input ref={ref} type="text" className=' h-full flex-1 placeholder:text-gray-600 p-2 outline-none ' placeholder='search anything' />
        <Search onClick={()=>{
           if(!ref.current?.value) return
           naigate(`/search/${ref.current?.value}`)
        }}  size={26} color=' gray' />
    </div>
    
    <div onClick={handelMenuClick} className={cn('  relative  sm:w-fit  ')}>

    <button  className='  sm:mr-5 w-full sm:w-fit px-4 py-2 bg-blue-500 rounded-md flex justify-center items-center text-white hover:opacity-80 '>Add New Post <Plus size={18} color='white'/> 
    

    </button>

    {
     isMenuVisible && Menu &&(
        <Suspense fallback={<div>Loading...</div>}>

        <Menu/>
        </Suspense>
        
      ) 
     }
    </div>
        
    </div>
  )
}

export default TopComponent
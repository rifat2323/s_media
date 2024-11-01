
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
const StoriesImg = () => {
    const [ref, inView] = useInView({
        threshold:.5,
    
      });
  return (
    <Avatar   ref={ref}  className={cn(' w-14 h-14 ring-2  ring-offset-4 ring-pink-500 ')} >
    <AvatarImage  src="https://github.com/shadcn.png" className={cn('',{
        "hidden":!inView
    })} />
    <AvatarFallback>CN</AvatarFallback>
    
  </Avatar>
  )
}

export default StoriesImg
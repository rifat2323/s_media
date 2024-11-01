
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useContext } from "react"
import { CardContext } from "@/context/CardCOntext"

const UserRec = () => {
  const {userInfo} = useContext(CardContext)
  return (
    <div className=' w-full flex justify-center gap-2 items-center  border-b py-2'>
      <Avatar    className=' w-10 h-10   ' >
            <AvatarImage  src={ userInfo.img||"https://placehold.co/60x60"} />
            <AvatarFallback>{userInfo.name}</AvatarFallback>
            
          </Avatar>
          <p className=' font-bold text-base'>{userInfo.name}</p>

    </div>
  )
}

export default UserRec
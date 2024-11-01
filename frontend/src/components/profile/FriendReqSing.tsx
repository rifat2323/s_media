import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useToast } from "@/hooks/use-toast"

interface FriendRequestProps {
  name: string,
  image: string,
  _id:string

}

export default function ComponentReq({ name, image,_id  }: FriendRequestProps) {
  const [isAccepted, setIsAccepted] = useState(false)
  const {toast} = useToast()
 const handelApectRequest = async ()=>{
 const {error,response} = await fetch_get_data(`user_friend/accept_friend_request?friendId=${_id}`)
    if(error || !response){
      toast({
        title:error?.response?.data
      })
      
       return
      }
      console.log(response)
      if(response.status === 200){
        setIsAccepted(true)
        toast({
          title:"friend request accepted"
        })
      }
 }


  return (
    <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name || "dumb"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-primary">{name}</h3>
              <p className="text-sm text-muted-foreground">Wants to be your friend</p>
            </div>
          </div>
          <Button
            variant={isAccepted ? "secondary" : "default"}
            size="icon"
            className={`transition-all ${
              isAccepted ? "bg-green-500 text-white hover:bg-green-600" : ""
            }`}
            
            disabled={isAccepted}
            onClick={handelApectRequest}
          >
            
            <Check className="h-4 w-4" />
            <span className="sr-only">Accept friend request</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
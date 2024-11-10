import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom'
import {format} from 'date-fns'

interface SocialMediaPostCardProps {

  mediaUrl: string
  textContent: string
  
  userId?: {
    name
: 
string,
profilePicture?
: 
string,
_id
: 
 string
  }

 
  _id: string
  createdAt:Date
}

export default function SocialMediaPostCard({
  
  mediaUrl,
  textContent,
  
  userId,
  createdAt,

  _id
}: SocialMediaPostCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  
 const navigate = useNavigate()
  return (
    <Card className="w-full mx-auto overflow-hidden shadow-md">
      <CardContent className="p-4">
        <div onClick={()=>navigate(`/visit_profile/${userId?._id}`)} className="flex items-center space-x-4 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userId?.profilePicture ||" https://placehold.co/60x60"} alt={ 'User'} />
            <AvatarFallback>{userId?.name || "user name"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">{ userId?.name || 'Anonymous User'}</h3>
            <p className="text-xs text-gray-500">{format(new Date(createdAt), 'MM/dd/yyyy hh:mm a') || 'Date unavailable'}</p>
          </div>
        </div>
        <p className="text-gray-800 mb-4">{textContent || 'No content available'}</p>
        {!imageError && (
          <div  onClick={()=>navigate(`/singlePost/${_id}`)} className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={mediaUrl}
              alt="Post image"
              className="absolute inset-0 w-full h-full "
              onError={handleImageError}
            />
          </div>
        )}
        {imageError && (
          <div  onClick={()=>navigate(`/singlePost/${_id}`)} className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Image unavailable</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
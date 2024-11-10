import React, { useEffect, useRef, useState } from 'react';
import { User, Users , FileText } from 'lucide-react';
import Post_Datas from '@/utils/fecthing/postDatas';
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import { CardContext } from '@/context/CardCOntext';
import { throttle } from "throttle-debounce"
import Post from '@/components/profile/Post';
import ImprovedColorfulFriendsList from '@/components/profile/Friends';

import FriendSugg from '@/components/profile/FriendSugg';
import FriendRequest from '@/components/profile/FriendRequest';

import UserProfile from '@/components/common/UserProfile';
import { useProfile } from '@/zustan/Profile';
import { useProfileSuggation } from '@/zustan/profile_Suggation';
import { useFriendReq } from '@/zustan/getFriendReq';

const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [friends,setFriend] = useState<[{FriendId:string}]| []>([])
  const profile_picture_ref = useRef<HTMLInputElement | null>(null)
  const profile_cover_ref = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false);
  const {toast} = useToast()
  const [shouldFetch, setShouldFetch] = useState(true);
  const {userInfo} = useContext(CardContext)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(()=>{
    const user_friend_data = localStorage.getItem("user_friend")
    const user_friend = JSON.parse(user_friend_data || "[]")
    setFriend(user_friend)
  },[])

 console.log("should fetch",shouldFetch)

  useEffect(()=>{
    if(!ref.current) return
   
    const element = ref.current
   const handelScroll =throttle( 300,()=>{
   
   
    if(element.scrollTop + element.clientHeight >=element.scrollHeight - 100){
      setShouldFetch(true)
     
    }else{
      setShouldFetch(false)
    }
  
   })
   
    element.addEventListener("scroll",handelScroll)
    return ()=>{
      element.removeEventListener("scroll",handelScroll)
    }
  
   },[])
  const handelUploadProfilePicture = async ()=>{
    if(!profile_picture_ref.current) return
    if(loading) return;


    setLoading(true)
       const fromData = new FormData()

      if(profile_picture_ref.current?.files?.[0]){
        fromData.append("image",profile_picture_ref.current?.files?.[0])
        
        }

        const {error,response} = await Post_Datas(`user_profile/uploadProfile_image`,fromData)

        if(error){
          toast({
            title:error?.response?.data
          })
          setLoading(false)
         }
         if(response?.status === 201){
          toast({
            title:"Picture uploaded successfully"
          })
          localStorage.setItem("user_info",JSON.stringify(response?.data?.user))
         }
         setLoading(false)


  }
  const handelUploadCoverImage = async ()=>{
    if(loading) return;
    if(!profile_cover_ref.current) return


    setLoading(true)
       const fromData = new FormData()

      if(profile_cover_ref.current?.files?.[0]){
        fromData.append("image",profile_cover_ref.current?.files?.[0])
        
        }

        const {error,response} = await Post_Datas(`user_profile/uploadCover_photo`,fromData)

        if(error){
          toast({
            title:error?.response?.data
          })
          setLoading(false)
         }
         if(response?.status === 201){
          toast({
            title:"Picture uploaded successfully"
          })
          localStorage.setItem("user_info",JSON.stringify(response?.data?.user))
         }
         setLoading(false)


  }

   const dataF = useProfile((state)=>state.friends)
   const noMoreFriend = useProfile((state)=>state.noMoreFriend)
   const setFriends = useProfile((state)=>state.setFriend)
   const suggationData = useProfileSuggation((state)=>state.data)
   const suggationSet = useProfileSuggation((state)=>state.getMoreSuggestion)
   const noMoreSuggestion = useProfileSuggation((state)=>state.noMoreSuggestion)
   const {Freq,getFriendReq,noMoreReq} = useFriendReq((state)=>state)
    console.log(Freq)
  return (
    <div ref={ref} className="max-w-4xl mx-auto mt-0 max-h-dvh overflow-y-auto scrollbar-hide ">
      {/* Cover Photo */}
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <label htmlFor='user-cover'>
        <input onChange={handelUploadCoverImage} type="file" accept='image/*' id='user-cover'  className="hidden" ref={profile_cover_ref} />
        <img
          className="w-full h-64 rounded-b-md object-cover"
          src={ userInfo.coverPhoto ? userInfo.coverPhoto :"https://via.placeholder.com/1000x300"} // Cover photo placeholder
          alt="Cover"
        />
        </label>
       
        {/* User Photo and Info */}
        <div className=" w-full flex ml-8 justify-start items-center gap-2">
          <label htmlFor="user-photo">
            <input onChange={handelUploadProfilePicture} type="file" accept='image/*' id='user-photo'  className="hidden" ref={profile_picture_ref} />
            <img
            className="rounded-full h-32 w-32 border-4 border-white"
            src={userInfo.img ? userInfo.img :"https://placehold.co/400x400" }
            alt="User"
          />

          </label>
        
          <div className="">
          <h1 className="text-2xl text-gray-950 font-bold">{userInfo.name}</h1>
          <p className="text-gray-600">{friends.length} Friends</p>
        </div>
        </div>
        
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="border-b flex justify-around">
          <button
            className={`py-4 w-1/3 text-center flex flex-col justify-center items-center ${
              activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <FileText className="inline-block mr-2  " /> <span className=' text-sm' >Posts</span> 
          </button>

          <button
           onMouseEnter={()=>{
            if(dataF && dataF.length && dataF.length > 0 || noMoreFriend ) return
            setFriends()
          }}

            className={`py-4 w-1/3 text-center flex flex-col justify-center items-center ${
              activeTab === 'friends' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('friends')}
          >
            <Users className="inline-block mr-2 " /> <span className=' text-sm'>Friends</span> 
          </button>

          <button
          onMouseEnter={()=>{
            if(suggationData && suggationData.length && suggationData.length > 0 || noMoreSuggestion ) return
            suggationSet()
          }}
            className={`py-4 w-1/3 text-center flex flex-col justify-center items-center ${
              activeTab === 'suggestions' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            <User className="inline-block mr-2 " />  <span className=' text-sm'>Suggestions</span> 
          </button>

          <button
          onMouseEnter={()=>{
            if(Freq && Freq.length && Freq.length > 0 || noMoreReq ) return
            getFriendReq()
          }}
            className={`py-4 w-1/3 text-center flex flex-col justify-center items-center ${
              activeTab === 'friend_request' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('friend_request')}
          >
            <User className="inline-block mr-2 " /> 
            <span className=' text-sm'>
            FriendRequest

            </span>
          
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'posts' && <Post shouldFetch={shouldFetch}/>}
          {activeTab === 'friends' && <ImprovedColorfulFriendsList shouldFetch={shouldFetch}/>}
          {activeTab === 'suggestions' && <FriendSugg/>}
          {activeTab === 'friend_request' && <FriendRequest shouldFetch={shouldFetch}/>}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

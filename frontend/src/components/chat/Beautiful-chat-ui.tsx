import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

import { Search, MessageCircle, MoreVertical } from 'lucide-react'

import { useChatList } from '@/zustan/Message'
import { formatDistanceToNow } from 'date-fns';
import { throttle } from 'throttle-debounce'

import { useNavigate } from 'react-router-dom'





export default function BeautifulChatUI() {
  const [searchTerm, setSearchTerm] = useState('')
  const {chatList,getFetchData,loading,isFetchingError,cursor,setVisible,resetConversation,conversationList,conversationCursor,isConversationError,getInitialConversation,getConversation,isConversationLoading,isChatVisible,isInitialDataLoad,getInitialData} = useChatList((state)=>state)
 
  const handelScroll = throttle(300, (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight} = target
    if(scrollHeight - scrollTop - clientHeight < 150 && !loading && !isFetchingError && isChatVisible){
      getFetchData(cursor)
    }
    if(!isChatVisible && !isConversationError && !isConversationLoading && conversationList.length){
      getConversation(conversationCursor,searchTerm)
    }
    
  })
  useEffect(()=>{
    if(isFetchingError || chatList.length || isInitialDataLoad) return
   
    getInitialData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    const throttledHandler = throttle(350,() => {
      if (searchTerm.length <= 2) {
        setVisible(true);
        resetConversation();
      } else {
        setVisible(false);
        if(conversationList.length || isConversationLoading ||isConversationError )return
        getInitialConversation(searchTerm);
      }
    });
  
    // Call throttled function whenever searchTerm changes
    throttledHandler();
  
    // Cleanup throttled function on unmount
    return () => {
      throttledHandler.cancel();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchTerm])
 const navigate = useNavigate()
  return (
    <div className="w-full max-w-full h-full  bg-white   border-gray-200">
      <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white ">
        <div className=' w-full flex items-center justify-between'>
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
      

        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations"
            className="pl-10 pr-4 py-2 w-full   placeholder-white/60  text-gray-950  focus:ring-white/50 rounded-lg transition-all duration-300"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div onScroll={handelScroll} className="h-[calc(100vh-200px)] min-h-[400px] max-h-[600px] overflow-y-auto">
        {isChatVisible && chatList.map((friend) => (
          <div onClick={()=>{
            navigate(`/message_to/${friend.FriendId._id}`)
          }} key={friend.FriendId._id} className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                  <AvatarImage src={friend.FriendId.profilePicture} alt={friend.FriendId.name} />
                  <AvatarFallback>{friend.FriendId.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {friend.isActive && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{friend.FriendId.name}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">
                    
                      {
                        friend.lastMessageTimestamp ?
                     formatDistanceToNow(new Date(friend.lastMessageTimestamp),{addSuffix:true}):null
                    }
                    
                    </p>
                  
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{friend.lastMessage}</span>
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-150">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {
          !isChatVisible && conversationList.map((conversation) => (
            <div key={conversation._id} className=' w-full display-flex justify-center items-center gap-2'>
              <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                  <AvatarImage src={conversation.sender.profilePicture} alt={conversation.sender.name} />
                  <AvatarFallback>{conversation?.sender?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className=' flex flex-col gap-1 items-center'>
                <h3 className="text-sm font-semibold text-gray-900 truncate">{conversation.sender.name}</h3>
                <div className=' flex flex-col gap-1'>
                  <p className='text-sm text-gray-950'>{conversation.Message}</p>
                  <p className='text-xs text-gray-500'>
                  {
                        conversation.sendTime ?
                     formatDistanceToNow(new Date(conversation.sendTime),{addSuffix:true}):null
                    }
                  </p>
          
                </div>
                </div>

            </div>
          ))
        }
        {
          !isChatVisible && conversationList.length===0 && (
            <h3 className="text-xl text-center mt-3  font-semibold text-gray-800 truncate">No Conversation Found</h3>
          )
        }
        {
          isChatVisible && chatList.length===0 && (
            <h3 className="text-sm font-semibold text-gray-900 truncate">No friend found</h3>
          )
        }
     
      </div>
     
    </div>
  )
}
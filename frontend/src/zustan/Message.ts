import {create} from 'zustand'
import fetch_get_data from '@/utils/fecthing/GetData';
import { AxiosResponse } from 'axios';

type chatList= {
    lastMessageTimestamp:Date,
    lastMessage:string,
    lastMessageSenderId:string,
    FriendId:{
        _id:string,
        name:string,
        profilePicture:string
    },
    isActive:boolean
}
type message = {
    sender:{
        _id:string,
        name:string,
        profilePicture:string
    };
    receiver:string;
    Message: string;
    createdAt: Date;
    sendTime: Date;
    _id:string
}
interface state {
    chatList: chatList[],
    conversationList: message[],
    conversationCursor:string,
    getFetchData: (cursor:string) => void,
    loading:boolean,
    isFetchingError:boolean,
    getInitialData:()=>void,
    cursor:string,
    isChatVisible:boolean,
    
    isConversationError:boolean,
    resetConversation:()=>void,
    getConversation:(cursor:string,text:string)=>void,
    getInitialConversation:(text:string)=>void,

    setVisible:(value:boolean)=>void,
    isConversationLoading:boolean,
    updateList:(data:{user_id:string,message:string})=>void,
    isInitialDataLoad:boolean
    
    
}

type apiReq = {
    friendList:chatList[],
    nextCursor:string
}

type api2 ={
    friends:message[],
    nextCursor:string
}
export const useChatList = create<state>((set) => ({
        chatList: [],
        conversationList:[],
        conversationCursor:'',
        isConversationError:false,
        loading:false,
        isFetchingError:false,
        cursor:'',
        isChatVisible:true,
       isConversationLoading:false,
       isInitialDataLoad:false,
       
        getFetchData: async (cursor:string) => {
            set({loading:true})
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`message/get_sort_message_friendList?cursor=${cursor}`)
            if(error || !response){
                set({isFetchingError:true})
                set({loading:false})
                return
            }else{
               set((sate)=>({
                chatList:[...(sate.chatList || []),...response.data.friendList],
                cursor:response.data.nextCursor,
                loading:false
               }))
            }
        },
        getInitialData: async ()=>{
            set({loading:true})
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`message/get_sort_message_friendList`)
            if(error || !response){
                set({isFetchingError:true})
                set({loading:false})
                
                return
            }else{
               set((sate)=>({
                chatList:[...(sate.chatList || []),...response.data.friendList],
                cursor:response.data.nextCursor,
                loading:false,
                isInitialDataLoad:true
               }))
            }
        },
        getConversation : async (cursor:string,text:string) => {
           set({isConversationLoading:true})

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const {response,error}:{response:AxiosResponse<api2> | null,error:any} = await fetch_get_data(`message/get_conversation?cursor=${cursor}&text=${text}`)
            if(error || !response){
                set({isConversationError:true})
                set({isConversationLoading:false})
                return
            }else{
               set((sate)=>({
                conversationList:[...(sate.conversationList || []),...response.data.friends],
                conversationCursor:response.data.nextCursor,
                
               
               }))
               set({isConversationLoading:false})
            }

        },
        resetConversation: ()=>{
            set({conversationList:[]})
            set({conversationCursor:''})
        },
        setVisible:(value:boolean)=>set({isChatVisible:value}),
        getInitialConversation : async (text:string) => {
            set({isConversationLoading:true})
 
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             const {response,error}:{response:AxiosResponse<api2> | null,error:any} = await fetch_get_data(`message/get_conversation?text=${text}`)
             if(error || !response){
                 set({isConversationError:true})
                 set({isConversationLoading:false})
                 return
             }else{
                set(()=>({
                 conversationList:response.data.friends,
                 conversationCursor:response.data.nextCursor,
                 
                
                }))
                set({isConversationLoading:false})
             }
 
         },

         updateList :  async (data:{user_id:string,message:string})=>{
           set((state)=>{
            const chatList = [...state.chatList];
            const index = chatList.findIndex((item) => item.FriendId._id === data.user_id);
      
            if (index !== -1) {
              // Update the existing message directly in the copied array
              chatList[index].lastMessage = data.message;
              chatList[index].lastMessageTimestamp = new Date();
      
              // Move the updated item to the top
              const [updatedItem] = chatList.splice(index, 1);
              chatList.unshift(updatedItem);
              return { chatList };
            }
      
            // Return the updated state
            return { chatList };
           })

           try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { response, error }: { response: AxiosResponse | null; error: any } = 
              await fetch_get_data(`/message/one_friend?friendId=${data.user_id}`);
            
            if(error || !response){
                return
            }
              
      
              
                // Add the new friend to the list
                set((state) => {
                  const chatList = [...state.chatList];
                  chatList.unshift({
                    ...response.data,
                    lastMessage: data.message,
                    lastMessageTimestamp: new Date(),
                    isActive:1
                  });
                  return { chatList };
                });
              
            
          } catch (err) {
            console.error('Failed to fetch data:', err);
          }

         }

    }));


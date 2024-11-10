import fetch_get_data from '@/utils/fecthing/GetData'
import {create} from 'zustand'
import { AxiosResponse } from 'axios'
type Card = {
    LikeCount:number,
    commentCount:number,
      postId:{
        _id:string,
        createdAt:string,
        mediaUrl?:string,
        textContent?:string,
        userId?:{
          name:string,
          profilePicture:string | null,
          _id:string
        }
  
  
      },
    _id:string
  
  }

  interface Friend {
    FriendId:{
        _id: string
        name: string
        profilePicture: string

    },
    createdAt:Date,
    _id:string
 
}
interface state {
card:Card[],
cursor:string,
loading:boolean,
noMoreCard:boolean,
cursor_friend:string,
loading_friend:boolean
noMoreCard_friend:boolean
Friend:Friend[],
getRefreshData:(id:string)=>void
getData:(id:string,cursor:string)=>void
getFriendList:(id:string,cursor:string)=>void
getInitialFriendData:(id:string,previousId:string)=>void
previousFriendId:string
noMoreFriend:boolean

}
type apiReq = {
    post:Card[],
    sendCursor:string
}
type apiReq2 = {
    post:Friend[],
    sendCursor:string
}


export const useVisitProfile = create<state>((set)=>({
    card:[],
    cursor:"",
    loading:false,
    noMoreCard:false,
    cursor_friend:'',
    loading_friend:false,
    noMoreCard_friend:false,
    Friend:[],
    previousFriendId:'',
    noMoreFriend:false,
    getRefreshData:async (id:string)=>{
        if(!id) return
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`visit_profile/visit_user_post?userId=${id}`)
         if(error || !response){
            set({noMoreCard:true})
            set({loading:false})
            return
         }else{
            set({card:response.data.post})
            set({cursor:response.data.sendCursor})
            set({loading:false})
         }
    },
  
    getData: async (id:string,cursor:string)=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`visit_profile/visit_user_post?userId=${id}&cursor=${cursor}`)
         if(error || !response){
            set({noMoreCard:true})
            set({loading:false})
            return
         }else{
           set((state)=>({
            card:[...(state.card || []),...(response.data.post || [])]
           }))
            set({cursor:response.data.sendCursor})
            set({loading:false})
         }
    },
  getFriendList: async (id:string,cursor:string)=>{
    set({loading_friend:true})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {response,error}:{response:AxiosResponse<apiReq2> | null,error:any} = await fetch_get_data(`visit_profile/visit_user_friend?userId=${id}&cursor=${cursor}`)
    if(error || !response){
        set({noMoreCard_friend:true})
        set({loading_friend:false})
        return
    }else{
        set((sate)=>({
         Friend:[...(sate.Friend || []),...response.data.post]
        }))
        set({cursor_friend:response.data.sendCursor})
        set({loading_friend:false})
    }
  },
  getInitialFriendData: async (id:string,previousId)=>{
    if(id === previousId) return

    set({previousFriendId:id})
    set({loading_friend:true})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {response,error}:{response:AxiosResponse<apiReq2> | null,error:any} = await fetch_get_data(`visit_profile/visit_user_friend?userId=${id}`)
    if(error || !response){
        set({noMoreCard_friend:true})
        set({loading_friend:false})
        return
    }else{
        set({Friend:response.data.post})
        set({cursor_friend:response.data.sendCursor})
        set({loading_friend:false})
    }
  }


}))
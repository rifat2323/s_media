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
  
  }[];
interface state{
    post: Card | [] | null
    cursor:string
    loading:boolean
    getProfilePost:(cursor?:string)=>void
    Refresh:(cursor?:string)=>void
    noMorePost:boolean
}

type apiReq = {
    post:Card,
    sendCursor:string
}

export const useProfilePost = create<state>((set)=>({
    post:[],
    cursor:'',
    loading:false,
    noMorePost:false,
    getProfilePost: async (cursor='')=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any } = await fetch_get_data(`user_profile/user_post/get_user_post?cursor=${cursor}`)
        if(!error && response){
            set((state) => ({
                post:[...(state.post || []),...(response.data.post || [])],
                cursor:response.data.sendCursor,
                loading:false
            }))
        }else{
            set({loading:false})
            set({noMorePost:true})
            if(error?.status === 408){
                set({noMorePost:true})
                set({loading:false})
            }
        }
    },
    Refresh: async (cursor='')=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any } = await fetch_get_data(`user_profile/user_post/get_user_post?cursor=${cursor}`)
        if(!error && response){
            set(() => ({
                Freq:response.data.post || [],
                cursor:response.data.sendCursor,
                loading:false
            }))
        }else{
            set({loading:false})
            set({noMorePost:true})
            if(error?.status === 404){
                set({noMorePost:true})
                set({loading:false})
            }
        }
    },

}))


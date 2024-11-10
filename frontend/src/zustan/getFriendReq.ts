import fetch_get_data from '@/utils/fecthing/GetData'
import {create} from 'zustand'
import { AxiosResponse } from 'axios'

type friend = {
    FriendId:{
        _id:string
        name:string
        profilePicture:string

    },
    _id:string
   
}[]
interface state{
    Freq: friend | [] | null
    cursor:string
    loading:boolean
    getFriendReq:(cursor?:string)=>void
    Refresh:(cursor?:string)=>void
    noMoreReq:boolean
}

type apiReq = {
    pendingFriendList:friend,
    sendCursor:string
}

export const useFriendReq = create<state>((set)=>({
    Freq:[],
    cursor:'',
    loading:false,
    noMoreReq:false,
    getFriendReq: async (cursor='')=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any } = await fetch_get_data(`user_friend/get_friend_pending_list?cursor=${cursor}`)
        if(!error && response){
            set((state) => ({
                Freq:[...(state.Freq || []),...(response.data.pendingFriendList || [])],
                cursor:response.data.sendCursor,
                loading:false
            }))
        }else{
            set({loading:false})
            set({noMoreReq:true})
            if(error?.status === 408){
                set({noMoreReq:true})
                set({loading:false})
            }
        }
    },
    Refresh: async (cursor='')=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any } = await fetch_get_data(`user_friend/get_friend_pending_list?cursor=${cursor}`)
        if(!error && response){
            set(() => ({
                Freq:response.data.pendingFriendList || [],
                cursor:response.data.sendCursor,
                loading:false
            }))
        }else{
            set({loading:false})
            set({noMoreReq:true})
            if(error?.status === 408){
                set({noMoreReq:true})
                set({loading:false})
            }
        }
    },

}))


import fetch_get_data from '@/utils/fecthing/GetData'
import { AxiosResponse } from 'axios'
import {create} from 'zustand'
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
interface state {
    post:Card[],
    loading:boolean,
    noMorePost:boolean,
    cursor:string,
    page:number,
    getMorePost:(page:number)=>void,
    getInitialData:()=>void,
    increasePage:()=>void
}



export const useSavedPost = create<state>((set)=>({
    post:[],
    loading:false,
    noMorePost:false,
    cursor:'',
    page:0,
    getInitialData:async ()=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<Card[]> | null ,error:any} = await fetch_get_data(`user_save/get_save_post?page=${0}`)
        
        if(error && !response ){
            set({noMorePost:true})
            set({loading:false})
            return
        }else{

        
          set({post:response?.data || [] })
          set({loading:false})
        }
    },
    increasePage :()=>set((state)=>({page:state.page + 1})),
    getMorePost: async (page )=>{
        set({loading:true})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<Card[]> | null,error:any} = await fetch_get_data(`user_save/get_save_post?page=${page}`)
        if(error && !response){
            set({noMorePost:true})
            set({loading:false})
            return
        }else{
          set({post:response?.data || []})
          set({loading:false})
        }
    }

}))
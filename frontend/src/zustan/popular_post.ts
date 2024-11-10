import fetch_get_data from '@/utils/fecthing/GetData';
import { AxiosResponse } from 'axios';
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
  
  };
  interface state {
    post_like:Card[],
    loading_like:boolean
    noMorePost_like:boolean,
    cursor_like:string,
    post_comment:Card[],
    loading_comment:boolean
    noMorePost_comment:boolean,
    cursor_comment:string,
    unAuthorized:boolean

   getFetchData:(cursor:string,type: "comment" | "like")=>void
   getInitialData:(type: "comment" | "like")=>void
  }

type apiReq = {
    post:Card[],
    sendCursor:string
}
export const usePopularPost = create<state>((set)=>({
    post_like:[],
    loading_like:false,
    noMorePost_like:false,
    cursor_like:'',
    post_comment:[],
    loading_comment:false,
    noMorePost_comment:false,
    cursor_comment:'',
    unAuthorized:false,
    getFetchData: async (cursor:string,type: "comment" | "like")=>{
    
        const url = type ==='like' ? "user_like/get_popular_like_post?":"user_comment/get_popular_comment_post?"
         if(type === "like"){
            set({loading_like:true})
         }else{
            set({loading_comment:true})
         }
        
         
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`${url}cursor=${cursor}`)
        if(error || !response){
          if(error.status === 401){
            set({unAuthorized:true})
          }
          console.log(error)
          console.log(type)
           if (type === "like"){
           
            set({noMorePost_like:true})
            set({loading_like:false})
            return

           }else{
            set({noMorePost_comment:true})
            set({loading_comment:false})
            return
           }
          
        }
        if(type === "like"){
          console.log(response)
            set((sate)=>({post_like:[...(sate.post_like || []),...(response.data.post || [])]}))
            set({cursor_like:response.data.sendCursor})
            set({loading_like:false})
            return
        }else{
            set((sate)=>({post_comment:[...(sate.post_comment || []),...(response.data.post || [])]}))
            set({cursor_comment:response.data.sendCursor})
            set({loading_comment:false})
            return
        }
    },
    getInitialData: async (type: "comment" | "like")=>{
        if(type === "like"){
            set({loading_like:true})
         }else{
            set({loading_comment:true})
         }
        const url = type ==='like' ? "user_like/get_popular_like_post?":"user_comment/get_popular_comment_post?"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {response,error}:{response:AxiosResponse<apiReq> | null,error:any} = await fetch_get_data(`${url}`)
        if(error || !response){
           if (type === "like"){
            set({noMorePost_like:true})
            set({loading_like:false})
            return

           }else{
            set({noMorePost_comment:true})
            set({loading_comment:false})
            return
           }
        }
        if(type === "like"){
            set({post_like:response.data.post})
            set({cursor_like:response.data.sendCursor})
            set({loading_like:false})
            return
        }else{
            set({post_comment:response.data.post})
            set({cursor_comment:response.data.sendCursor})
            set({loading_comment:false})
            return
         
        }
    },

  


}))


import fetch_get_data from '@/utils/fecthing/GetData'
import { AxiosResponse } from 'axios'
import {create} from 'zustand'

type Data = {
    FriendId:{
        name:string,
    profilePicture:string,
    _id:string

    }
    
    createdAt:Date,
    _id:string
}[]
interface state{
    friends:Data | [] | null
    cursor:string | ''
    noMoreFriend:boolean
    setFriend:()=>void,
    isError:boolean,
    getMoreFriend:(cursor:string | "")=>void


}
type ApiResponse = {
    friend: Data;
    sendCursor:string // This indicates that the response will have a 'friend' property which is an array of Friend objects
};

export const useProfile = create<state>((set)=>({
    friends:[],
    isError:false,
    cursor:'',
    noMoreFriend:false,
    setFriend: async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { response, error }:{ response: AxiosResponse<ApiResponse> | null, error: any } = await fetch_get_data(`user_profile/get_user_friend`);
        
        if (!error) {
            set({ friends: response?.data.friend });
            set({cursor:response?.data.sendCursor})
            set({isError:false})
        } else {
            console.error("Failed to fetch friends:", error);
            set({ isError: true });
            if(error.status === 404){
                set({noMoreFriend:true})
            }
        }
    },
    getMoreFriend:async (cursor) =>{
       
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const { response, error }:{ response: AxiosResponse<ApiResponse> | null, error: any } = await fetch_get_data(`user_profile/get_user_friend?cursor=${cursor}`);
        
       if (!error && response) {
        set((state) => ({
            friends: [
                ...(state.friends || []), // Use empty array if `state.friends` is null
                ...(response?.data.friend || []) // Fallback to empty array if `response?.data.friend` is null
            ],
            cursor: response?.data.sendCursor || "", // Ensure `cursor` is always a string, even if `sendCursor` is null
            isError: false // Reset error state if the fetch is successful
        }));
       } else {
           console.error("Failed to fetch friends:", error);
           set({ isError: true });
           if(error.status === 404){
            set({noMoreFriend:true})
        }
           
       }
    }

}))

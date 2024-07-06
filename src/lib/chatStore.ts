
import { create } from "zustand";

import { useUserStore } from "./userStore";

type UserStore = {
    chatId : any;
    user : any;
    isCurrentUserBlocked : boolean,
    isReceiverBlocked : boolean,
    changeBlock : () => void;
    changeChat : (chatId : any,user : any) => void;
}

export const useChatStore = create<UserStore>((set)=>({
    chatId : null,
    user : null,
    isCurrentUserBlocked : false,
    isReceiverBlocked : false,
    changeChat : (chatId : any,user : any) => {
        const currentUser = useUserStore.getState().currentUser;

        // CHECK IF CURRENT USER IS BLOCKED

        if(user.blocked.includes(currentUser.id)){
            return set({
                chatId,
                user : null,
                isCurrentUserBlocked : true,
                isReceiverBlocked : false,
            })
        } else


         // CHECK IF RECEIVER IS BLOCKED

        if(user.blocked.includes(user.id)){
            return set({
                chatId,
                user : user,
                isCurrentUserBlocked : false,
                isReceiverBlocked : true,
            })
        } else {
            return set({
                chatId,
                user,
                isCurrentUserBlocked : false,
                isReceiverBlocked : false,
            })
        }
    },

    changeBlock : () => {
        set(state => ({
            ...state,isReceiverBlocked : !state.isReceiverBlocked 
        }))
    }

    



}))
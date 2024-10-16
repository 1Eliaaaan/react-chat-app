
import { create } from "zustand";

import { useUserStore } from "./userStore";

type UserStore = {
    chatId : any;
    user : any;
    isCurrentUserBlocked : boolean,
    isReceiverBlocked : boolean,
    changeBlock : () => void;
    resetChat: () => void;
    changeChat : (chatId : any,user : any, selectedChat : any) => void;
    changeChatMessages : (messages : any) => void;
    messages : [];
}

export const useChatStore = create<UserStore>((set)=>({
    chatId : null,
    user : null,
    isCurrentUserBlocked : false,
    isReceiverBlocked : false,
    messages : [],
    changeChat : (chatId : any, user : any) => {
        const currentUser = useUserStore.getState().currentUser;
        // CHECK IF CURRENT USER IS BLOCKED

        if(user.blocked.includes(currentUser.id)){
            return set({
                chatId,
                user : null,
                isCurrentUserBlocked : true,
                isReceiverBlocked : false
            })
        } else


         // CHECK IF RECEIVER IS BLOCKED

        if(user.blocked.includes(user.id)){
            return set({
                chatId,
                user : user,
                isCurrentUserBlocked : false,
                isReceiverBlocked : true
            })
        } else {
            return set({
                chatId,
                user,
                isCurrentUserBlocked : false,
                isReceiverBlocked : false
            })
        }
    },
    changeBlock : () => {
        set(state => ({
            ...state,isReceiverBlocked : !state.isReceiverBlocked 
        }))
    },
    changeChatMessages : (chatMessages : any) => {
        return set({
            messages: chatMessages
        })
    },
      resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  }
}))
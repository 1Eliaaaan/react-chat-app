import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

type UserStore = {
    currentUser : any;
    isLoading : boolean;
    fetchUserInfo : (uid : any) => Promise<void>
}

export const useUserStore = create<UserStore>((set)=>({
    currentUser : null,
    isLoading : true, // Start with loading true
    fetchUserInfo : async (uid : string) => {
        console.log("UID ON FETCHUSER", uid)
        if(!uid) {
            set({currentUser : null, isLoading : false})
            return
        }
    
        try {
            set({ isLoading: true }) // Set loading when fetching user data
            
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef)
            
            if(docSnap.exists()){
                set({currentUser : docSnap.data(), isLoading : false})
            } else {
                // If user document doesn't exist yet, wait a bit and try again
                setTimeout(async () => {
                    try {
                        const retryDocSnap = await getDoc(docRef)
                        if(retryDocSnap.exists()) {
                            set({currentUser : retryDocSnap.data(), isLoading : false})
                        } else {
                            set({currentUser : null, isLoading : false})
                        }
                    } catch (error) {
                        console.log("Retry error:", error)
                        set({currentUser : null, isLoading : false})
                    }
                }, 500)
            }

        } catch (error) {
            console.log(error);
            set({currentUser : null, isLoading : false})
        }
    }
}))
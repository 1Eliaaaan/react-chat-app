import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

type UserStore = {
    currentUser : any;
    isLoading : boolean;
    fetchUserInfo : (uid: any) => Promise<void>
}

export const useUserStore = create<UserStore>((set)=>({
    currentUser : null,
    isLoading : false,
    fetchUserInfo : async (uid : string) => {
        console.log("UID ON FETCHUSER", uid)
        if(!uid) return set({currentUser : null , isLoading : false})
    
            try {

                const docRef = doc(db,"users",uid);

     

                const docSnap = await getDoc(docRef)
                
             

                if(docSnap.exists()){
                    set({currentUser : docSnap.data(), isLoading : false})
                } else {
                    set({currentUser : null, isLoading : false})
                }

            } catch (error) {
                console.log(error);
                return set({currentUser : null, isLoading : false})
            }

        }

    



}))
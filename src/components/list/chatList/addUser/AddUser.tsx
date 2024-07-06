import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css"
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () =>{ 

    const { currentUser } = useUserStore()
    const [user,setUser] = useState <any>(null)
    const handleAdd = async ()=> {

            const chatRef = collection(db,"chats");
            const userChatsRef = collection(db,"userchats");
        try {
           const newChatRef = doc(chatRef) 
            await setDoc(newChatRef, 
            {
                createdAt : serverTimestamp(),
                messagess : [],
            }
            );

            await updateDoc(doc(userChatsRef, user?.id), {
                chats :arrayUnion({
                    chatId : newChatRef.id,
                    lastMessage : "",
                    receiverId :currentUser.id,
                    updatedAt : Date.now()
                })
            })

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats :arrayUnion({
                    chatId : newChatRef.id,
                    lastMessage : "",
                    receiverId :user?.id,
                    updatedAt : Date.now()
                })
            })

            console.log(newChatRef.id)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSearch = async(e : any) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const username = formData.get("username");

        try {
            
            const userRef = collection(db,"users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShop : any = await getDocs(q)

            if(!querySnapShop.empty){
                setUser(querySnapShop.docs[0].data());
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="UserName" name="username" />
                <button>Search</button>
            </form>
       {
        user &&      <div className="user">
        <div className="detail">
            <img src={user.avatar || "/src/assets/avatar.png"} alt="" />
            <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
        </div>
       }
        </div>
    )
}
export default AddUser
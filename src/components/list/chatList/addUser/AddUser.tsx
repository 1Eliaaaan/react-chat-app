import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css"
import { db } from "../../../../lib/firebase";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () =>{ 

    const { currentUser } = useUserStore()
    const [user,setUser] = useState <any>(null)
    const [users,setUsers] = useState <any>(null)
    const getUsers = async () => {
        try {
          const userRef = collection(db, "users");
          const querySnapshot = await getDocs(userRef);
          const usersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(usersList)
          setUsers(usersList);
        } catch (error) {
          console.error("Error obteniendo usuarios:", error);
        }
      };
    
      // se ejecuta al cargar el componente
      useEffect(() => {
        getUsers();
      }, []);
      const handleAdd = async (u: any)=> {
        const chatRef = collection(db,"chats");
        const userChatsRef = collection(db,"userchats");
      
        try {
          const newChatRef = doc(chatRef);
          await setDoc(newChatRef, {
            createdAt : serverTimestamp(),
            messagess : [],
          });
      
          // chat para el usuario seleccionado
          await updateDoc(doc(userChatsRef, u.id), {
            chats : arrayUnion({
              chatId : newChatRef.id,
              lastMessage : "",
              receiverId : currentUser.id,
              updatedAt : Date.now()
            })
          });
      
          // chat para el usuario actual
          await updateDoc(doc(userChatsRef, currentUser.id), {
            chats : arrayUnion({
              chatId : newChatRef.id,
              lastMessage : "",
              receiverId : u.id,
              updatedAt : Date.now()
            })
          });
      
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
                console.log("userRef",userRef)
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
            <form className="search-user-form" onSubmit={handleSearch}>
                <input type="text" placeholder="UserName" name="username" />
                <button className="search-user-btn">Search</button>
            </form>
        
            {users && users.length > 0 && users.map((u : any) => (
   <div className="user">
   <img className="list-add-user-img" src={u.avatar || "/src/assets/avatar.png"} alt={u.username} />
   
   <div className="user-data">
     <span className="user-name">{u.username}</span>
     <span className="user-email">{u.email}</span>
   </div>
 
   <div className="btn-container">
     <button className="add-user-btn" onClick={() => handleAdd(u)}>Add User</button>
   </div>
 </div>
))}
        </div>
    )
}
export default AddUser
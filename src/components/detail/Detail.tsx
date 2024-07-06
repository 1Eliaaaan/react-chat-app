import { AiOutlineDown, AiOutlineDownload } from "react-icons/ai"
import "./detail.css"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
const Detail = () => {

    const {user,isCurrentUserBlocked,isReceiverBlocked, changeBlock} = useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async()=>{
        if(!user) return;

        const userDocRef = doc(db,"users",currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })

            changeBlock()

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "/src/assets/avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <AiOutlineDown className="arrowIcon"/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <AiOutlineDown className="arrowIcon"/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <AiOutlineDown className="arrowIcon"/>
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                       <div className="photoDetail">
                       <img src="https://pbs.twimg.com/media/GPKQdLIakAAVLbO?format=jpg&name=900x900" alt="" />
                            <span>photo_2024_2.png</span>
                       </div>
                       <AiOutlineDownload className="downloadIcon"/>
                        </div>
                        <div className="photoItem">
                       <div className="photoDetail">
                       <img src="https://pbs.twimg.com/media/GPKQdLIakAAVLbO?format=jpg&name=900x900" alt="" />
                            <span>photo_2024_2.png</span>
                       </div>
                       <AiOutlineDownload className="downloadIcon"/>
                        </div>
                        <div className="photoItem">
                       <div className="photoDetail">
                       <img src="https://pbs.twimg.com/media/GPKQdLIakAAVLbO?format=jpg&name=900x900" alt="" />
                            <span>photo_2024_2.png</span>
                       </div>
                       <AiOutlineDownload className="downloadIcon"/>
                        </div>
                        <div className="photoItem">
                       <div className="photoDetail">
                       <img src="https://pbs.twimg.com/media/GPKQdLIakAAVLbO?format=jpg&name=900x900" alt="" />
                            <span>photo_2024_2.png</span>
                       </div>
                       <AiOutlineDownload className="downloadIcon"/>
                        </div>
                        <div className="photoItem">
                       <div className="photoDetail">
                       <img src="https://pbs.twimg.com/media/GPKQdLIakAAVLbO?format=jpg&name=900x900" alt="" />
                            <span>photo_2024_2.png</span>
                       </div>
                       <AiOutlineDownload className="downloadIcon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <AiOutlineDown className="arrowIcon"/>
                    </div>
                  
                </div>
                <button onClick={()=>handleBlock()}>{isCurrentUserBlocked ? "You´re blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
                <button className="logout" onClick={()=>auth.signOut}>Logout</button>
            </div>
        </div>
    )
}
export default Detail
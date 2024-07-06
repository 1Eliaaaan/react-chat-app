import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css"
import { AiOutlineEdit, AiOutlineMore,AiOutlineVideoCameraAdd  } from "react-icons/ai";
const UserInfo = () => {

    const {currentUser} = useUserStore();

    return (
        <div className="userInfo">
        <div className="user">
            <img src={currentUser.avatar || "/src/assets/avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
        <AiOutlineMore />
        <AiOutlineVideoCameraAdd />
        <AiOutlineEdit />
            <img src="./edit.png" alt="" />
        </div>
        </div>
    )
}
export default UserInfo
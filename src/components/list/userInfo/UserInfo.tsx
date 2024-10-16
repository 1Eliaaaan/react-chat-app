import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css";
import { AiOutlineBell, AiOutlineSetting } from "react-icons/ai";
const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "/src/assets/avatar.png"} alt="" />
        <h2 className="userName">{currentUser.username}</h2>
      </div>

      <div className="iconsUserInfo">
        <div className="iconsUserInfoContainer">
          <AiOutlineBell className="iconUserInfo" />
        </div>
        <div className="iconsUserInfoContainer">
          <AiOutlineSetting className="iconUserInfo" />
        </div>
      </div>
    </div>
  );
};
export default UserInfo;

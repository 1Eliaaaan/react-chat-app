import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { auth } from "../../../lib/firebase";
import "./userInfo.css";
import { AiOutlineBell, AiOutlineSetting } from "react-icons/ai";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const { resetChat } = useChatStore();
  const [showLogout, setShowLogout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  const toggleLogout = () => {
    console.log('Toggle logout clicked, current state:', showLogout);
    setShowLogout(!showLogout);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

  // Debug effect
  useEffect(() => {
    console.log('showLogout changed to:', showLogout);
  }, [showLogout]);

  return (
    <div className="userInfo" ref={menuRef}>
      <div className="user">
        <img  className="user-info-img"src={currentUser.avatar || "/src/assets/avatar.png"} alt="" />
        <h2 className="userName">{currentUser.username}</h2>
      </div>

      <div className="iconsUserInfo">
        <div className="iconsUserInfoContainer">
          <AiOutlineBell className="iconUserInfo" />
        </div>
        <div className="iconsUserInfoContainer" onClick={toggleLogout}>
          <AiOutlineSetting className="iconUserInfo" />
        </div>
      </div>

      {showLogout && (
        <div className="logoutSection">
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;


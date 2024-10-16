import { AiOutlineDown, AiOutlineDownload } from "react-icons/ai";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useState } from "react";
const Detail = () => {
  const {
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    messages,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();
  const [expandedOption, setExpandedOption] = useState<String | null>(null);
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOptionClick = (option: string) => {
    if (expandedOption === option) {
      setExpandedOption(null);
    } else {
      setExpandedOption(option);
    }
  };
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "/src/assets/avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div
          className="option"
          onClick={() => handleOptionClick("chatSettings")}
        >
          <div className="optionTitle">
            <span>Chat Settings</span>
            {expandedOption === "chatSettings" ? (
              <BsChevronUp className="arrowIcon" />
            ) : (
              <BsChevronDown className="arrowIcon" />
            )}
          </div>
        </div>
        <div
          className="option"
          onClick={() => handleOptionClick("privacyHelp")}
        >
          <div className="optionTitle">
            <span>Privacy & Help</span>
            {expandedOption === "privacyHelp" ? (
              <BsChevronUp className="arrowIcon" />
            ) : (
              <BsChevronDown className="arrowIcon" />
            )}
          </div>
        </div>
        <div
          className="option"
          onClick={() => handleOptionClick("sharedPhotos")}
        >
          {expandedOption === "sharedPhotos" ? (
            <div className="optionTitle">
              <span>Shared Photos</span>
              <BsChevronUp className="arrowIcon" />
            </div>
          ) : (
            <div className="optionTitle">
              <span>Shared Photos</span>
              <BsChevronDown className="arrowIcon" />
            </div>
          )}
        </div>
        {expandedOption === "sharedPhotos" ? (
          <div>
            <div className="photos">
              {messages
                .filter((message: any) => message.img)
                .map((message: any) => (
                  <div className="photoItem" key={message.id}>
                    <div className="photoDetail">
                      <img src={message.img} alt="" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div
          className="option"
          onClick={() => handleOptionClick("sharedFiles")}
        >
          <div className="optionTitle">
            <span>Shared Files</span>
            {expandedOption === "sharedFiles" ? (
              <BsChevronUp className="arrowIcon" />
            ) : (
              <BsChevronDown className="arrowIcon" />
            )}
          </div>
        </div>
        <button onClick={() => handleBlock()}>
          {isCurrentUserBlocked
            ? "You´re blocked"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Detail;

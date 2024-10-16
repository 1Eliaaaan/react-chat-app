import { useEffect, useState } from "react";
import "./chatList.css";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import AddUser from "./addUser/AddUser";
import { useChatStore } from "../../../lib/chatStore";
const ChatList = () => {
  const [chats, setChats] = useState<any>([]);
  const [addMode, setAddMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>({
    chatId: null,
  });

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data()!.chats;

        const promises = items.map(async (item: any) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  function formatTime(epoch: number) {
    const date = new Date(epoch * 1000);
    return date.toLocaleString().split(",")[1];
  }

  const handleSelect = async (chat: any) => {
    console.log("chat", chat);
    setSelectedChat(chat);
    const userChats = chats.map((item: any) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item: any) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user, selectedChat);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <div className="iconSearchContainer">
            <AiOutlineSearch className="searchIcon" />
          </div>
          <input type="text" placeholder="Search" />
          <div
            className="addIconContainer"
            onClick={() => setAddMode((prev: boolean) => !prev)}
          >
            {!addMode ? (
              <AiOutlinePlus className="addIcon" />
            ) : (
              <AiOutlineMinus className="addIcon" />
            )}
          </div>
        </div>
      </div>
      <div className="chats">
        {chats.map((chat: any) => (
          <div
            className={`item ${
              selectedChat.chatId === chat.chatId ? "selected" : ""
            }`}
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
          >
            <img src={chat.user.avatar || "/src/assets/avatar.png"} alt="" />
            <div className="texts">
              <span>{chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
            <div className="time-container">
              {" "}
              {/* Nuevo contenedor */}
              <div className="time">
                <span>{formatTime(chat.updatedAt)}</span>
              </div>
              {chat.isSeen ?? (
                <div className="circle">
                  <span>1</span> {/* Contador de mensajes no leídos */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {addMode && <AddUser />}
    </div>
  );
};
export default ChatList;

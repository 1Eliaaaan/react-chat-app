import {
  AiOutlineAudio,
  AiOutlineCamera,
  AiOutlineFileAdd,
  AiOutlineInfoCircle,
  AiOutlinePhone,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BsEmojiSmile, BsSend } from "react-icons/bs";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState<any>();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const endRef = useRef<HTMLDivElement>(null);

  const {
    chatId,
    user,
    isReceiverBlocked,
    isCurrentUserBlocked,
    changeChatMessages,
  } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollTop = endRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);
  useEffect(() => {
    if (chat && chat.messages) {
      changeChatMessages(chat.messages);
    }
  }, [chat]);

  const handleSend = async () => {
    console.log(text);
    console.log(img);
    if (text === "") {
      if (!img.url) {
        return;
      }
    }

    let imgUrl: any = "";

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshop = await getDoc(userChatsRef);

        if (userChatsSnapshop.exists()) {
          const userChatsData = userChatsSnapshop.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c: any) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  };

  const handleEmoji = (e: any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/src/assets/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet .</p>
          </div>
        </div>
        <div className="icons">
          <div className="iconTopContainer">
            <AiOutlinePhone className="phoneIcon" />
          </div>
          <div className="iconTopContainer">
            <AiOutlineVideoCameraAdd className="cameraIcon" />
          </div>
          <div className="iconTopContainer">
            <AiOutlineInfoCircle className="infoIcon" />
          </div>
        </div>
      </div>
      <div className="center" ref={endRef}>
        {chat?.messages?.map((message: any) => (
          <div
            className={
              message.senderId === currentUser.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            {message.senderId === currentUser.id ? (
              <div className="avatarImage">
                <img
                  src={currentUser.avatar || "/src/assets/avatar.png"}
                  alt=""
                  className="imgProfile"
                />
              </div>
            ) : (
              <div className="avatarImage">
                <img
                  src={user.avatar || "/src/assets/avatar.png"}
                  alt=""
                  className="imgProfile"
                />
              </div>
            )}
            <div className="messageContainer">
              {message.img && <img src={message.img} alt="" />}
              {message.text && <p className="text">{message.text}</p>}
              {/* <span>{message.createdAt}</span> */}
            </div>
          </div>
        ))}
      </div>
      <div className="bottom">
        <div className="iconsBottom">
          <div className="iconContainer">
            <label htmlFor="file" className="iconBottom">
              <AiOutlineFileAdd className="iconBottom" />
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleImg}
              />
            </label>
          </div>

          <div className="iconContainer">
            <AiOutlineCamera className="iconBottom" />
          </div>
          <div className="iconContainer">
            <AiOutlineAudio className="iconBottom" />
          </div>
        </div>
        <div className="input-container">
          {img.url && (
            <div className="sendImgPreviewContainer">
              <div className="imageWrapper">
                <img alt="" src={img.url} className="sendImagePreview" />
                <span
                  className="removeImageIcon"
                  onClick={() => {
                    setImg({
                      file: null,
                      url: "",
                    });
                  }}
                >
                  &times;
                </span>
              </div>
            </div>
          )}
          <input
            type="text"
            placeholder="Type a message..."
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !isCurrentUserBlocked &&
                !isReceiverBlocked
              ) {
                handleSend();
              }
            }}
          />

          <button
            className="sendButton"
            onClick={() => handleSend()}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            <div className="inputButtonContainerIcon">
              <BsSend className="inputButtonIcon" />
            </div>
          </button>
        </div>
        <div className="emoji">
          <BsEmojiSmile
            className="icon"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker
              open={open}
              onEmojiClick={handleEmoji}
              theme={"dark"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;

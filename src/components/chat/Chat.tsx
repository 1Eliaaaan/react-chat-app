import { AiOutlineAudio, AiOutlineCamera, AiOutlineFileAdd, AiOutlineFileImage, AiOutlineInfoCircle, AiOutlinePhone, AiOutlineVideoCameraAdd } from "react-icons/ai"
import { BsEmojiSmile } from "react-icons/bs";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {

    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [chat, setChat] = useState<any>()
    const [img, setImg] = useState({
        file: null,
        url: ""
    })
    const endRef = useRef<null | HTMLDivElement>(null);

    const { chatId, user,isReceiverBlocked,isCurrentUserBlocked } = useChatStore()
    const { currentUser } = useUserStore()

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])


    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub()
        }
    }, [chatId])
    console.log(chat)

    const handleSend = async () => {
        if (text === "") return;


        let imgUrl: any = "";

        try {

            if(img.file){
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img : imgUrl }),
                })
            })

            const userIds = [currentUser.id, user.id]

            userIds.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshop = await getDoc(userChatsRef);

                if (userChatsSnapshop.exists()) {
                    const userChatsData = userChatsSnapshop.data()

                    const chatIndex = userChatsData.chats.findIndex((c : any)  => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })


        } catch (error) {
            console.log(error)
        }

        setImg({
            file : null,
            url : ""
        })

        setText("");
    }


    const handleEmoji = (e: any) => {
        setText((prev) => prev + e.emoji);
        setOpen(false)
    }
    console.log(text)

    const handleImg  = (e: any) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
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
                    <AiOutlinePhone />
                    <AiOutlineVideoCameraAdd />
                    <AiOutlineInfoCircle />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message : any) => (
                    <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
                        {message.img &&
                            <img src={message.img} alt="" />}
                        <div className="texts">
                            <p>{message.text}</p>
                            {/* <span>{message.createdAt}</span> */}
                        </div>
                    </div>
                ))}
              {
                img.url && (
                    <div className="message own">
                    <div className="texts">
                        <img alt="" src={img.url}/>
                    </div>
                </div>
                )
              }
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                    <AiOutlineFileAdd className="icon"  />
                    </label>
                    <input type="file" id="file" style={{display: "none"}} onChange={handleImg} />
                    <AiOutlineFileImage className="icon" />
                    <AiOutlineCamera className="icon" />
                   
                    <AiOutlineAudio className="icon" />
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    onChange={e => setText(e.target.value)}
                    value={text}
                />
                <div className="emoji">
                    <BsEmojiSmile className="icon" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={() => handleSend()} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}
export default Chat
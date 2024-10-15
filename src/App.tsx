
import Chat from './components/chat/Chat'
import List from './components/list/List'
import Detail from './components/detail/Detail'
import Login from './components/login/Login'
import Notification from './components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'
import ChatContentLoader from './components/chat/contentLoader/contentLoader'
import DetailContentLoader from './components/detail/detailContentLoader/detailContentLoader'


function App() {

  const { currentUser,isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()
  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return ()=>{
      unSub();
    } 
    
  },[])
  console.log("currentUser",currentUser)
  if(isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
       <>
          <List/>
         {chatId ? <Chat/> : <ChatContentLoader/>}
         {chatId ? <Detail/> : <DetailContentLoader/>} 
       </> 
        ) : (
          <Login/>
        )
      }
      <Notification/>
 
    
    </div>
  );
}

export default App

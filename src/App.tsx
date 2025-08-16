
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/chat/Chat'
import List from './components/list/List'
import Detail from './components/detail/Detail'
import Login from './components/login/Login'
import Landing from './components/landing/Landing'
import Notification from './components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'
import ChatContentLoader from './components/chat/contentLoader/contentLoader'
import DetailContentLoader from './components/detail/detailContentLoader/detailContentLoader'

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()
  
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    } 
  }, [])
  
  console.log("currentUser", currentUser)
  
  if (isLoading) return <div className='loading'>Loading...</div>

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className='container'><Landing /></div>} />
        <Route path="/login" element={
          <div className='container'><Login /></div>} />
        <Route path="/chat" element={
          currentUser ? (
            <div className='container'>
              <List/>
              {chatId ? <Chat/> : <ChatContentLoader/>}
              {chatId ? <Detail/> : <DetailContentLoader/>} 
              <Notification/>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App

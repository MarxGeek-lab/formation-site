'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import Backdrop from '@mui/material/Backdrop'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

// Slice Imports
import { getActiveUserData } from '@/redux-store/slices/chat'

// Component Imports
import SidebarLeft from './SidebarLeft'
import ChatContent from './ChatContent'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import { useAuthStore, useMessagesStore } from '@/contexts/GlobalContext'

const ChatWrapper = () => {
  const { user } = useAuthStore();
  const { getMessagesByOwner } = useMessagesStore();
  // States
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([]);
  const [usersActive, setUsersActive] = useState([]);

  // Refs
  const messageInputRef = useRef(null)

  // Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const [chatStore, setChartStore] = useState([]);
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  // Focus on message input when active user changes
  useEffect(() => {
    if (chatStore.activeUser?.id !== null && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [chatStore.activeUser])

  // Close backdrop when sidebar is open on below md screen
  useEffect(() => {
    if (!isBelowMdScreen && backdropOpen && sidebarOpen) {
      setBackdropOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowMdScreen])

  // Open backdrop when sidebar is open on below sm screen
  useEffect(() => {
    if (!isBelowSmScreen && sidebarOpen) {
      setBackdropOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowSmScreen])

  // Close sidebar when backdrop is closed on below md screen
  useEffect(() => {
    if (!backdropOpen && sidebarOpen) {
      setSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  const getActiveUsersMessage = async (id) => {
    if (messages.length > 0) {
      const message = messages.find(item => item?._id === id);
      setChartStore(message)
      return message;
    }
  }

  const fetchMessage = async() => {
    if (user) {
      try {
        const { data, status } =  await getMessagesByOwner(user?._id);
        setMessages(data);
        setUsersActive(data.map(item => item));
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchMessage();
  },[user]);

    // Get active user’s data
    const activeUser = async id => {
      await getActiveUsersMessage(id)
    }

  return (
    <div
      className={classNames(commonLayoutClasses.contentHeightFixed, 'flex is-full overflow-hidden rounded relative', {
        border: settings.skin === 'bordered',
        'shadow-md': settings.skin !== 'bordered'
      })}
    >
      <SidebarLeft
        chatStore={chatStore}
        getActiveUserData={activeUser}
        contactUsers={usersActive}
        messagesStore={messages}
        dispatch={dispatch}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowSmScreen={isBelowSmScreen}
        messageInputRef={messageInputRef}
      />

      <ChatContent
        chatStore={chatStore}
        allChatStore={messages}
        setMessages={setMessages}
        dispatch={dispatch}
        fetchMessage={fetchMessage}
        updateChatStore={activeUser}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        setSidebarOpen={setSidebarOpen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowSmScreen={isBelowSmScreen}
        messageInputRef={messageInputRef}
      />

      <Backdrop open={backdropOpen} onClick={() => setBackdropOpen(false)} className='absolute z-10' />
    </div>
  )
}

export default ChatWrapper

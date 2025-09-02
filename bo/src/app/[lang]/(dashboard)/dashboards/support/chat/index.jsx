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
import ChatContent from './ChatContent'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import { useAuthStore, useHelpCenterStore, useMessagesStore } from '@/contexts/GlobalContext'

const ChatWrapper = () => {
  const { user } = useAuthStore();
  const { getDiscussionByUser } = useHelpCenterStore();
  // States
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Refs
  const messageInputRef = useRef(null)

  // Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const [chatStore, setChartStore] = useState([]);
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

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

  const fetchMessage = async() => {
    if (user) {
      try {
        const { data, status } =  await getDiscussionByUser(user?._id);
        console.log(data)
        setChartStore(data[0])
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {

    fetchMessage();
  },[user]);


  return (
    <div
      className={classNames(commonLayoutClasses.contentHeightFixed, 'flex is-full overflow-hidden rounded relative', {
        border: settings.skin === 'bordered',
        'shadow-md': settings.skin !== 'bordered'
      })}
    >

      <ChatContent
        chatStore={chatStore}
        dispatch={dispatch}
        fetchMessage={fetchMessage}
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

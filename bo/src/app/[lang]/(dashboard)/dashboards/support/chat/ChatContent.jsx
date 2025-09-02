// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

// Component Imports
import AvatarWithBadge from './AvatarWithBadge'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'
import CustomAvatar from '@core/components/mui/Avatar'

import iconWhat from '@assets/images/whatsapp.webp';
import Image from 'next/image'
import { showLoader } from '@/components/Loader/loaderService'

// Renders the user avatar with badge and user information
const UserAvatar = ({ activeUser, setUserProfileLeftOpen, setBackdropOpen }) => (
  <div
    className='flex items-center gap-4 cursor-pointer'
    onClick={() => {
      setUserProfileLeftOpen(true)
      setBackdropOpen(true)
    }}
  >
    <AvatarWithBadge
      alt={activeUser?.name}
      src={activeUser?.picture}
      color={'primary'}
      badgeColor={'success'}
    />
    <div>
      <Typography color='text.primary'>Support assistance</Typography>
      <Typography variant='body2'>discutez avec nos administrateurs</Typography>
    </div>
  </div>
)

const ChatContent = props => {
  // Props
  const {
    fetchMessage,
    chatStore,
    dispatch,
    backdropOpen,
    setBackdropOpen,
    setSidebarOpen,
    isBelowMdScreen,
    isBelowSmScreen,
    isBelowLgScreen,
    messageInputRef
  } = props

  // States
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)

  useEffect(() => {
    if (!backdropOpen && userProfileRightOpen) {
      setUserProfileRightOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  return (
    <>
      {/* {activeUser && ( */}
        <div className='flex flex-col flex-grow bs-full bg-backgroundChat'>
          <div className='flex items-center justify-between border-be plb-[1px] pli-6 bg-backgroundPaper'>
            {isBelowMdScreen ? (
              <div className='flex items-center gap-4'>
                <IconButton
                  color='secondary'
                  onClick={() => {
                    setSidebarOpen(true)
                    setBackdropOpen(true)
                  }}
                >
                  <i className='tabler-menu-2' />
                </IconButton>
                <UserAvatar
                  activeUser={chatStore?.user}
                  setBackdropOpen={setBackdropOpen}
                  setUserProfileLeftOpen={setUserProfileRightOpen}
                />
              </div>
            ) : (
              <UserAvatar
                activeUser={chatStore?.user}
                setBackdropOpen={setBackdropOpen}
                setUserProfileLeftOpen={setUserProfileRightOpen}
              />
            )}
             <IconButton color='primary'
                href={`https://wa.me/2290169816413`}>
                <Image src={iconWhat} width={60} height={60} alt='' />
              </IconButton>
          </div>

          <ChatLog
            chatStore={chatStore}
            isBelowMdScreen={isBelowMdScreen}
            isBelowSmScreen={isBelowSmScreen}
            isBelowLgScreen={isBelowLgScreen}
          /> 

          <SendMsgForm
            updateChatStore={fetchMessage}
            dispatch={dispatch}
            activeUser={chatStore?.user}
            chatId={chatStore?._id}
            fetchMessage={fetchMessage}
            isBelowSmScreen={isBelowSmScreen}
            messageInputRef={messageInputRef}
          />
        </div>
      {/* )} */}
    </>
  )
}

export default ChatContent

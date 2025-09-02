// React Imports
import { useRef, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Formats the chat data into a structured format for display.
const formatedChatData = (chats, profileUser) => {
  const formattedChatData = []
  let chatMessageSenderId = chats[0] ? chats[0].senderId : profileUser.id
  let msgGroup = {
    senderId: chatMessageSenderId,
    messages: []
  }

  chats.forEach((chat, index) => {
    if (chatMessageSenderId === chat.senderId) {
      msgGroup.messages.push({
        time: chat.time,
        message: chat.message,
        msgStatus: chat.msgStatus
      })
    } else {
      chatMessageSenderId = chat.senderId
      formattedChatData.push(msgGroup)
      msgGroup = {
        senderId: chat.senderId,
        messages: [
          {
            time: chat.time,
            message: chat.message,
            msgStatus: chat.msgStatus
          }
        ]
      }
    }

    if (index === chats.length - 1) formattedChatData.push(msgGroup)
  })

  return formattedChatData
}

// Wrapper for the chat log to handle scrolling
const ScrollWrapper = ({ children, isBelowLgScreen, scrollRef, className }) => {
  if (isBelowLgScreen) {
    return (
      <div ref={scrollRef} className={classnames('bs-full overflow-y-auto overflow-x-hidden', className)}>
        {children}
      </div>
    )
  } else {
    return (
      <PerfectScrollbar ref={scrollRef} options={{ wheelPropagation: false }} className={className}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const ChatLog = ({ chatStore, isBelowLgScreen, isBelowMdScreen, isBelowSmScreen }) => {
  
  // Refs
  const scrollRef = useRef(null)

  // Function to scroll to bottom when new message is sent
  const scrollToBottom = () => {
    if (scrollRef.current) {
      if (isBelowLgScreen) {
        // @ts-ignore
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      } else {
        // @ts-ignore
        scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight
      }
    }
  }

  // Scroll to bottom on new message
  useEffect(() => {
    console.log("chatStore == ", chatStore)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStore])

  return (
    <ScrollWrapper isBelowLgScreen={isBelowLgScreen} scrollRef={scrollRef}>
      <CardContent className='p-0'>
        {chatStore?.chat?.length > 0 &&
            chatStore.chat.map((msgGroup, index) => {
            const isSender = msgGroup?.type === 'message'
              // console.log("msgGroup == ", chatStore.chat)
            return (
              <div key={index} className={classnames('flex gap-4 p-6', { 'flex-row-reverse': isSender })}>
                {/* <Avatar alt={chatStore?.user?.name} src={chatStore?.user?.picture} className='is-8 bs-8' /> */}
                {!isSender && (
                  <CustomAvatar
                    color={'primary'}
                    skin='light'
                    size={32}
                  >
                    {getInitials(msgGroup?.adminId?.name || 'Admin' )}
                  </CustomAvatar>
                )}
                <div
                  className={classnames('flex flex-col gap-2', {
                    'items-end': isSender,
                    'max-is-[65%]': !isBelowMdScreen,
                    'max-is-[75%]': isBelowMdScreen && !isBelowSmScreen,
                    'max-is-[calc(100%-5.75rem)]': isBelowSmScreen
                  })}
                >
                  <Typography
                    key={index}
                    className={classnames('whitespace-pre-wrap pli-4 plb-2 shadow-xs', {
                      'bg-backgroundPaper rounded-e rounded-b': isSender,
                      'bg-primary text-[var(--mui-palette-primary-contrastText)] rounded-s rounded-b': isSender
                    })}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {msgGroup.content}
                  </Typography>
                {/*   {isSender && (
                    <i className='tabler-checks text-success text-base' />
                  )} */}
                  { msgGroup.createdAt ? (
                    <Typography variant='caption'>
                      {new Date(msgGroup.createdAt).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </Typography>
                  ) : null}
                  {isSender ? (
<></>
                  ):(<></>)}
                </div> 
              </div>
            )
          })}
      </CardContent>
    </ScrollWrapper>
  )
}

export default ChatLog

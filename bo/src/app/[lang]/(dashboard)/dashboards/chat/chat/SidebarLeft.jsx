// React Imports
import { useState } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Slice Imports
import { addNewChat } from '@/redux-store/slices/chat'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomChip from '@core/components/mui/Chip'
import UserProfileLeft from './UserProfileLeft'
import AvatarWithBadge from './AvatarWithBadge'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { formatDateToMonthShort } from './utils'
import Image from 'next/image'

export const statusObj = {
  busy: 'error',
  away: 'warning',
  online: 'success',
  offline: 'secondary'
}

// Render chat list
const renderChat = props => {
  // Props
  const { chatStore, getActiveUserData, contactUsers, messagesStore, setSidebarOpen, backdropOpen, setBackdropOpen, isBelowMdScreen } = props

  return messagesStore.map(chat => {
    const contact = contactUsers.find(contact => chat?._id === contact?._id)
    const isChatActive = chatStore?._id === contact?._id

    return (
      <li
        key={chat._id}
        className={classnames('flex items-start gap-4 pli-3 plb-2 cursor-pointer rounded mbe-1', {
          'bg-primary shadow-primarySm': isChatActive,
          'text-[var(--mui-palette-primary-contrastText)]': isChatActive
        })}
        onClick={() => {
          getActiveUserData(chat?._id)
          isBelowMdScreen && setSidebarOpen(false)
          isBelowMdScreen && backdropOpen && setBackdropOpen(false)
        }}
      >
        <AvatarWithBadge
          src={contact?.user?.picture}
          isChatActive={isChatActive}
          alt={contact?.user?.name}
          badgeColor={'primary'}
          color='primary'
        />
        <div className='min-is-0 flex-auto'>
          <Typography color='inherit'>{contact?.user?.name}</Typography>
          {chat.chat.length ? (
            <Typography variant='body2' color={isChatActive ? 'inherit' : 'text.secondary'} className='truncate'>
              {chat.chat[chat.chat.length - 1].content}
            </Typography>
          ) : (
            <Typography variant='body2' color={isChatActive ? 'inherit' : 'text.secondary'} className='truncate'>
              {contact.role}
            </Typography>
          )}
        </div>
        <div className='flex flex-col items-end justify-start'>
          <Typography
            variant='body2'
            color='inherit'
            className={classnames('truncate', {
              'text-textDisabled': !isChatActive
            })}
          >
            {chat.chat.length ? formatDateToMonthShort(chat.chat[chat.chat.length - 1]?.createdAt) : null}
          </Typography>
          <CustomChip round='true' label={chat.chat.length || 0} color='error' size='small' /> 
        </div>
      </li>
    )
  })
}

// Scroll wrapper for chat list
const ScrollWrapper = ({ children, isBelowLgScreen }) => {
  if (isBelowLgScreen) {
    return <div className='bs-full overflow-y-auto overflow-x-hidden'>{children}</div>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const SidebarLeft = props => {
  // Props
  const {
    chatStore,
    getActiveUserData,
    contactUsers,
    messagesStore,
    dispatch,
    backdropOpen,
    setBackdropOpen,
    sidebarOpen,
    setSidebarOpen,
    isBelowLgScreen,
    isBelowMdScreen,
    isBelowSmScreen,
    messageInputRef
  } = props

  // States
  const [userSidebar, setUserSidebar] = useState(false)
  const [searchValue, setSearchValue] = useState()

  const handleChange = (event, newValue) => {
    if (!newValue) return;
    
    const selectedContact = contactUsers.find(contact => contact?.user?.name === newValue);
    if (selectedContact) {
      getActiveUserData(selectedContact._id);
      setSearchValue(newValue);
      
      if (isBelowMdScreen) {
        setSidebarOpen(false);
        setBackdropOpen(false);
      }
    }
  }

  return (
    <>
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className='bs-full'
        variant={!isBelowMdScreen ? 'permanent' : 'persistent'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: isBelowMdScreen && sidebarOpen ? 11 : 10,
          position: !isBelowMdScreen ? 'static' : 'absolute',
          ...(isBelowSmScreen && sidebarOpen && { width: '100%' }),
          '& .MuiDrawer-paper': {
            overflow: 'hidden',
            boxShadow: 'none',
            width: isBelowSmScreen ? '100%' : '370px',
            position: !isBelowMdScreen ? 'static' : 'absolute'
          }
        }}
      >
        <div className='flex items-center plb-[18px] pli-6 gap-4 border-be'>
         {/*  <AvatarWithBadge
            alt={chatStore.profileUser.fullName}
            src={chatStore.profileUser.avatar}
            badgeColor={statusObj[chatStore.profileUser.status]}
            onClick={() => {
              setUserSidebar(true)
            }}
          /> */}
          <div className='flex is-full items-center flex-auto sm:gap-x-3'>
            <Autocomplete
              fullWidth
              size='small'
              id='select-contact'
              options={contactUsers.map(contact => contact?.user?.name).filter(Boolean) || []}
              value={searchValue || null}
              onChange={handleChange}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  variant='outlined'
                  placeholder='Recherche un contact'
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-search' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
              renderOption={(props, option) => {
                const contact = contactUsers.find(contact => contact?.user?.name === option)
              
                return (
                  <li
                    {...props}
                    key={option.toLowerCase().replace(/\s+/g, '-')}
                    className={classnames('gap-3 max-sm:pli-3 flex items-center', props.className)}
                  >
                    {contact ? (
                      contact?.user?.picture ? (
                        <>
                          <Avatar
                          alt={contact?.user?.name}
                          src={contact?.user?.picture}
                          key={option.toLowerCase().replace(/\s+/g, '-')}
                        /> 
                        </>
                      ) : (
                        <CustomAvatar
                          color={'primary'}
                          skin='light'
                          key={option.toLowerCase().replace(/\s+/g, '-')}
                        >
                          {getInitials(contact?.user?.name)}
                        </CustomAvatar>
                      )
                    ) : null}
                    <div className='flex flex-col'>
                      <Typography>{option}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {contact?.user?.email}
                      </Typography>
                    </div>
                  </li>
                )
              }}
            />
            {isBelowMdScreen ? (
              <IconButton
                className='mis-2'
                size='small'
                onClick={() => {
                  setSidebarOpen(false)
                  setBackdropOpen(false)
                }}
              >
                <i className='tabler-x text-2xl' />
              </IconButton>
            ) : null}
          </div>
        </div>
        <ScrollWrapper isBelowLgScreen={isBelowLgScreen}>
          <ul className='p-3 pbs-4'>
            {renderChat({
              chatStore,
              getActiveUserData,
              contactUsers,
              messagesStore,
              backdropOpen,
              setSidebarOpen,
              isBelowMdScreen,
              setBackdropOpen
            })}
          </ul>
        </ScrollWrapper>
      </Drawer>

      <UserProfileLeft
        userSidebar={userSidebar}
        setUserSidebar={setUserSidebar}
        profileUserData={chatStore.profileUser}
        dispatch={dispatch}
        isBelowLgScreen={isBelowLgScreen}
        isBelowSmScreen={isBelowSmScreen}
      />
    </>
  )
}

export default SidebarLeft

// React Imports
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

// Slice Imports
import { sendMsg } from '@/redux-store/slices/chat'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import { useAuthStore, useHelpCenterStore, useMessagesStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'

// Emoji Picker Component for selecting emojis
const EmojiPicker = ({ onChange, isBelowSmScreen, openEmojiPicker, setOpenEmojiPicker, anchorRef }) => {
  return (
    <>
      <Popper
        open={openEmojiPicker}
        transition
        disablePortal
        placement='top-start'
        className='z-[12]'
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'top-start' ? 'right top' : 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpenEmojiPicker(false)}>
                <span>
                  <Picker
                    emojiSize={18}
                    theme='light'
                    data={data}
                    maxFrequentRows={1}
                    onEmojiSelect={emoji => {
                      onChange(emoji.native)
                      setOpenEmojiPicker(false)
                    }}
                    {...(isBelowSmScreen && { perLine: 8 })}
                  />
                </span>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

const SendMsgForm = ({ dispatch, activeUser, chatId, updateChatStore, fetchMessage, isBelowSmScreen, messageInputRef }) => {
  // States
  const [msg, setMsg] = useState('')
  const { user } = useAuthStore();
  const { SubmitQuiz } = useHelpCenterStore();

  const handleSendMsg = async (event, msg) => {
    event.preventDefault()

    if (msg.trim() !== '') {
      showLoader();
      try {
        const formData = {
          content: msg,
          type: 'message',
          user: user?._id
        }
        const { data, status } = await SubmitQuiz(formData);
        hideLoader();
        if (status === 200) {
          showToast('Message envoyé !', 'success', 5000)
          fetchMessage();
          setMsg('');
          
          setTimeout(() => {
            updateChatStore(chatId);
            console.log('update')
          }, 5000);
        } else {
          showToast('Message non envoyé. Veuillez réessayer', 'error', 5000)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleInputEndAdornment = () => {
    return (
      <div className='flex items-center gap-1'>
          <CustomIconButton variant='contained' color='primary' type='submit'>
            <i className='tabler-send' />
          </CustomIconButton>
      </div>
    )
  }


  return (
    <form autoComplete='off' onSubmit={event => handleSendMsg(event, msg)}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder='Saisissez un message'
        value={msg}
        className='p-6'
        onChange={e => setMsg(e.target.value)}
        sx={{
          '& fieldset': { border: '0' },
          '& .MuiOutlinedInput-root': {
            background: 'var(--mui-palette-background-paper)',
            boxShadow: 'var(--mui-customShadows-xs) !important'
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMsg(e, msg)
          }
        }}
        size='small'
        inputRef={messageInputRef}
        slotProps={{ input: { endAdornment: handleInputEndAdornment() } }}
      />
    </form>
  )
}

export default SendMsgForm

'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid2'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getInitials } from '@/utils/getInitials'

import dayjs from '@configs/dayjs.config'
import { convertDate } from '@/utils/convertDate'
import { useCommonStore } from '@/contexts/CommonContext'
import { useAuthStore } from '@/contexts/AuthContext'
import { Card, CardContent } from '@mui/material'

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = params => {
  const { avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin } = params

  if (avatarImage) {
    return <Avatar src={avatarImage} />
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        <i className={avatarIcon} />
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title)}
      </CustomAvatar>
    )
  }
}

const NotificationDropdown = () => {
  // States
  const [notificationsState, setNotificationsState] = useState([])

  const ref = useRef(null)

  const { token, user } = useAuthStore();
  const { fetchNotifications } = useCommonStore();

  const getNotifications = async () => {
    if (user) {
      try {
        const { data, status } = await fetchNotifications(user?._id, 'owner');
        setNotificationsState(data.map(item => ({
          id: item?._id,
          // avatarText: item.type === 'reservation' ? 'R':'N',
          title: item.title,
          subtitle: item.content,
          time: convertDate(item.createdAt),
          read: item.read,
          avatarImage: item.user.picture
        })));
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getNotifications()
  }, [user])

  const notificationCount = notificationsState.filter(notification => !notification.read).length
  const readAll = notificationsState.every(notification => notification.read)

  // Read notification when notification is clicked
  const handleReadNotification = (event, value, index) => {
    event.stopPropagation()
    const newNotifications = [...notificationsState]

    newNotifications[index].read = value
    setNotificationsState(newNotifications)
  }

  // Remove notification when close icon is clicked
  const handleRemoveNotification = (event, index) => {
    event.stopPropagation()
    const newNotifications = [...notificationsState]

    newNotifications.splice(index, 1)
    setNotificationsState(newNotifications)
  }

  // Read or unread all notifications when read all icon is clicked
  const readAllNotifications = () => {
    const newNotifications = [...notificationsState]

    newNotifications.forEach(notification => {
      notification.read = !readAll
    })
    setNotificationsState(newNotifications)
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        // Calculate available height, subtracting any fixed UI elements' height as necessary
        const availableHeight = window.innerHeight - 100
        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
  }, [])


  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12}} className='bs-full flex flex-col'>
            <div className='flex items-center justify-between plb-3.5 pli-4 is-full gap-2'>
              <Typography variant='h6' className='flex-auto'>
                Notifications
              </Typography>
              {notificationCount > 0 && (
                <Chip size='small' variant='tonal' color='primary' label={`${notificationsState.length} notifications`} />
              )}
            
            </div>
            <Divider />
            <Grid size={{ xs: 12 }}>
              {notificationsState.map((notification, index) => {
                const {
                  id,
                  title,
                  subtitle,
                  time,
                  read,
                  avatarImage,
                  avatarIcon,
                  avatarText,
                  avatarColor,
                  avatarSkin
                } = notification

                return (
                  <div
                    key={id}
                    className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                      'border-be': index !== notificationsState.length - 1
                    })}
                    onClick={e => handleReadNotification(e, true, id)}
                  >
                    {getAvatar({ avatarImage, avatarIcon, title, avatarText, avatarColor, avatarSkin })}
                    <div className='flex flex-col flex-auto'>
                      <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                        {title}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' className='mbe-2' 
                        /* style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1, // Specify the number of lines
                          WebkitBoxOrient: 'vertical',
                        }} */>
                        {subtitle}
                      </Typography>
                      <Typography variant='caption' color='text.disabled'>
                        {time}
                      </Typography>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <Badge
                        variant='dot'
                        color={read ? 'secondary' : 'primary'}
                        onClick={e => handleReadNotification(e, !read, index)}
                        className={classnames('mbs-1 mie-1', {
                          'invisible group-hover:visible': read
                        })}
                      />
                    </div>
                  </div>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default NotificationDropdown

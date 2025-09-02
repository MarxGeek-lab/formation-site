"use client"
// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { Button, Typography } from '@mui/material'
import Link from '@/components/Link'
import { BUYER_URL, URL_SITE } from '@/settings'
import { useAuthStore, useCommonStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'
import { convertDate } from '@/utils/convertDate'
import { getTimeAgo } from '@/utils/date'
import { useParams, useSearchParams } from 'next/navigation'

const NavbarContent = () => { 
 const { lang: locale } = useParams();
 const { token, user } = useAuthStore();
 const { fetchNotifications } = useCommonStore();
 const [notifications, setNotifications] = useState([]);
 const searchParams = useSearchParams();

 const getNotifications = async () => {
   if (user) {
     try {
       const { data, status } = await fetchNotifications(user?._id, 'owner');
  
       setNotifications(data.map(item => ({
         id: item?._id,
         avatarText: item.type === 'reservation' ? 'R':'N',
         title: item.title,
         subtitle: item.content,
         time: getTimeAgo(item.createdAt),
         read: true
       })));
     } catch (error) {
       console.log(error);
     }
   }
 }

 useEffect(() => {
   getNotifications()
 }, [user]);


   useEffect(() => {
     const token = searchParams.get('token');
     if (token) {
       localStorage.setItem("accessToken", token);
     }
   },[searchParams]);

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-6'>
        <NavToggle />
        {/* <NavSearch /> */}
        <Typography className="hidden sm:block nowrap">Bienvenue {user?.name || 'Administrateur'} ! </Typography>
      </div>
      {/* <div className='flex items-center'> */}
        {/* <LanguageDropdown /> */}
        {/* <ModeDropdown /> */}
        {/* <ShortcutsDropdown shortcuts={shortcuts} /> */}
        {/* <NotificationsDropdown notifications={notifications} />
        <UserDropdown />
      </div> */}
    </div>
  )
}

export default NavbarContent

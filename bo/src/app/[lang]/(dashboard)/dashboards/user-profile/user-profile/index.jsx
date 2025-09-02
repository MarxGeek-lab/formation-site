'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'
import { useAuthStore } from '@/contexts/GlobalContext'

const UserProfile = ({ tabContentList, data }) => {
  // States
  const [activeTab, setActiveTab] = useState('profile')
  const { user, getUserById } = useAuthStore();
  
 /*  const handleChange = (event, value) => {
    setActiveTab(value)
  }
   */
  const [ userProfile, setUserProfile ] = useState();
  const fetchUserProfile = async () => {
      if (user) {
          try {
              const { data, status } = await getUserById(user._id);
              if (status === 200) {
                  setUserProfile(data);
              }
          } catch (error) {
              console.log(error);
          }
      }
  }
  
  useEffect(() => {
      fetchUserProfile();
  }, [user]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserProfileHeader data={userProfile} />
      </Grid>
      <Grid size={{ xs: 12 }} className='flex flex-col gap-6'>
        {tabContentList[activeTab]}
      </Grid>
    </Grid>
  )
}

export default UserProfile

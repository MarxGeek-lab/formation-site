'use client';
// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import UserProfile from './user-profile'

// Data Imports
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/contexts/AuthContext'

const ProfileTab = dynamic(() => import('./user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
// const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections'))

// Vars

const ProfilePage = () => {
  // Vars
  const { user, getUserById } = useAuthStore();
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

  const tabContentList = data => ({
    profile: <ProfileTab data={userProfile} />,
    teams: <TeamsTab data={userProfile} />,
    // projects: <ProjectsTab data={data?.users.projects} />,
    // connections: <ConnectionsTab data={data?.users.connections} />
  })

  return <UserProfile data={userProfile} tabContentList={tabContentList(userProfile)} />
}

export default ProfilePage

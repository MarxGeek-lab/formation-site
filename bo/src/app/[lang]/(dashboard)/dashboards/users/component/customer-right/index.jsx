'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

const CustomerRight = ({ tabContentList }) => {
  // States
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab icon={<i className='tabler-user' />} value='overview' label="Vue d'ensemble" iconPosition='start' />
              <Tab /* icon={<i className='tabler-lock' />} */ value='reservation' label='Réservations' iconPosition='start' />
              <Tab
                // icon={<i className='tabler-map-pin' />}
                value='rental'
                label='Locations'
                iconPosition='start'
              />
              <Tab
                // icon={<i className='tabler-bell' />}
                value='payments'
                label='Paiements'
                iconPosition='start'
              />
            </CustomTabList>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TabPanel value={activeTab} className='p-0'>
              {tabContentList[activeTab]}
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  )
}

export default CustomerRight

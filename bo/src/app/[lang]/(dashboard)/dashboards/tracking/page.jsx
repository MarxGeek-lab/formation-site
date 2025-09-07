'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

import TrackingDashboard from '@/components/TrackingDashboard';

const DashboardTracking = () => {
  return (
    <Grid container spacing={6}>
      {/* Tracking Dashboard */}
      <Grid size={{ xs: 12 }}>
        <TrackingDashboard />
      </Grid>
    </Grid>
  )
}

export default DashboardTracking

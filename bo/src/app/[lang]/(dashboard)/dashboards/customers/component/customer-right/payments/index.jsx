'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderListTable from './OrderListTable'

// Data Imports

const Overview = ({ payments }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={payments} />
      </Grid>
    </Grid>
  )
}

export default Overview

'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderListTable from './ListTable';

// Data Imports

const Overview = ({ reservation }) => {

  console.log("reservation id === ", reservation)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={reservation} />
      </Grid>
    </Grid>
  )
}

export default Overview

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import { useEffect, useState } from 'react'

const Payments = ({ paymentsData }) => {
  const [ stats, setStats ] = useState(null);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable paymentsData={paymentsData} />
      </Grid>
    </Grid>
  )
}

export default Payments

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Box, Typography } from '@mui/material'

const TableFilters = ({ setData, ordersData }) => {
  // States
  const [statusOrder, setStatusOrder] = useState('')
  const [statusPayment, setStatusPayment] = useState('')

  useEffect(
    () => {
      const filteredData = ordersData.filter(property => {
        if (statusOrder && statusOrder !== 'all' && property.status !== statusOrder) return false
        if (statusPayment && statusPayment !== 'all' && property.paymentStatus !== statusPayment) return false

        return true
      })
      setData(filteredData)
    },
    [statusOrder, statusPayment]
  )

  return (
    // <CardContent>
      <Box className='flex flex-wrap gap-2'>
        <Typography variant='h6' fontSize={16} className='mr-3'>Filtrer par</Typography>
        <CustomTextField
          select
          id='select-status'
          value={statusOrder}
          onChange={e => setStatusOrder(e.target.value)}
          slotProps={{
            select: { displayEmpty: true }
          }}
          className='min-is-[130px] text-sm'
        >
          <MenuItem value=''>Status</MenuItem>
          <MenuItem value='all'>Tout</MenuItem>
          <MenuItem value='pending'>En attente</MenuItem>
          <MenuItem value='confirmed'>Confirmé</MenuItem>
          <MenuItem value='delivered'>Livré</MenuItem>
          <MenuItem value='cancelled'>Annulé</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          id='select-status'
          value={statusPayment}
          onChange={e => setStatusPayment(e.target.value)}
          slotProps={{
            select: { displayEmpty: true }
          }}
          className='min-is-[130px] pr-6 text-sm'
        >
          <MenuItem value=''>Status de paiement</MenuItem>
          <MenuItem value='all'>Tout</MenuItem>
          <MenuItem value='paid'>Payé</MenuItem>
          <MenuItem value='pending'>En attente</MenuItem>
          <MenuItem value='partiallyPaid'>Partiellement payé</MenuItem>
          <MenuItem value='refunded'>Remboursé</MenuItem>
        </CustomTextField>
      </Box>
    // </CardContent>
  )
}

export default TableFilters

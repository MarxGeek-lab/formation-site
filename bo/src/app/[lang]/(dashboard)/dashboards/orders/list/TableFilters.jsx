// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'

const TableFilters = ({ setData, ordersData }) => {
  // States
  const [statusOrder, setStatusOrder] = useState('')
  const [statusPayment, setStatusPayment] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(
    () => {
      const filteredData = ordersData.filter(property => {
        if (statusOrder && statusOrder !== 'all' && property.status !== statusOrder) return false
        if (statusPayment && statusPayment !== 'all' && property.paymentStatus !== statusPayment) return false
        
        // Date filtering
        if (dateFrom) {
          const orderDate = dayjs(property.createdAt)
          const fromDate = dayjs(dateFrom)
          if (orderDate.isBefore(fromDate, 'day')) return false
        }
        
        if (dateTo) {
          const orderDate = dayjs(property.createdAt)
          const toDate = dayjs(dateTo)
          if (orderDate.isAfter(toDate, 'day')) return false
        }

        return true
      })
      setData(filteredData)
    },
    [statusOrder, statusPayment, dateFrom, dateTo, ordersData, setData]
  )

  return (
    // <CardContent>
      <Box className='flex flex-col gap-2 w-full mb-3'>
        <Typography variant='h6' fontSize={16} className='mr-3'>Filtrer par</Typography>
        <Box className="flex items-end flex-wrap gap-2">
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
          <CustomTextField
            type='date'
            label='Date de début'
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className='min-is-[150px] text-sm'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <CustomTextField
            type='date'
            label='Date de fin'
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className='min-is-[150px] text-sm'
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>
    // </CardContent>
  )
}

export default TableFilters

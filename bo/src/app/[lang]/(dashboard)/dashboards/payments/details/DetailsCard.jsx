'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import Link from '@components/Link'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import dayjs from '@/configs/dayjs.config';
import { formatAmount } from '@/utils/formatAmount'
import { Avatar, Chip } from '@mui/material'
import { API_URL_ROOT } from '@/settings'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const status = {
  pending: { title: 'En cours', color: 'warning' },
  failed: { title: 'Annulé', color: 'error'},
  success: { title: 'Succès', color: 'success' },
  refunded: { title: 'Remboursement', color: 'info' }
}

const DetailsCard = ({ paymentData }) => {
  return (
    <Card>
      <CardHeader
        title='Details du paiement'
      />
      <CardContent className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Commande ID :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          ORD-{paymentData?.order?._id?.slice(0, 6).toUpperCase()}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Montant :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {formatAmount(paymentData?.amount || 0)} F CFA
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Méthode de paiement :
        </Typography>
        <Typography color='text.primary' className='text-nowrap uppercase'>
          {paymentData?.paymentMethod === 'MOBILE' ?  paymentData?.mobileProvider: paymentData?.paymentMethod}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Status :
        </Typography>
        <Chip
            variant='tonal'
            label={status[paymentData.status]?.title}
            color={status[paymentData.status]?.color}
            size='small'
          />
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-is-[100px]'>
          Date de paiement :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {paymentData?.createdAt && dayjs(paymentData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </Typography>
      </div>
      </CardContent>
    </Card>
  )
}

export default DetailsCard

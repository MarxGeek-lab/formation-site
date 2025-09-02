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
import { statusLocObj, statusPayObj } from '@/data/constant'
import { Chip, Rating } from '@mui/material'

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

const OrderDetailsCard = ({ review }) => {
  return (
    <Card>
      <CardHeader
        title='Details Avis'
      />
      <CardContent className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Nom du bien :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {review?.product?.name}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Commentaire :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {review?.comment}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Note :
        </Typography>
        <Rating
          name='product-review'
          readOnly
          value={review?.rating}
          emptyIcon={<i className='tabler-star-filled' />}
        />
      </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Date du commentaire :
          </Typography>
          <Typography color='text.primary' className='font-medium'>
            {review?.createdAt && dayjs(review?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderDetailsCard

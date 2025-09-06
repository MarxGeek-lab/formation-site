'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

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
import { formatAmount } from '@/utils/formatAmount'
import { Box, Chip, IconButton } from '@mui/material'
import { statusLocObj, statusPayObj } from '@/data/constant'
import dayjs from 'dayjs'

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


// Column Definitions
const columnHelper = createColumnHelper()

const OrderPayment = ({orderData}) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  useEffect(() => {
    setData(orderData || [])
  }, [orderData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('amount', {
        header: 'Montant',
        cell: ({ row }) => <Typography variant='body2'>{`${formatAmount(row.original?.amount || 0)}`} FCFA</Typography>
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Méthode de paiement',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Typography variant='body2' color='text.primary' className='font-medium'>
              {row.original?.transaction?.paymentMethod === 'MOBILE' ? row.original?.transaction?.mobileProvider : row.original?.transaction?.paymentMethod}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('paymentDate', {
        header: 'Date',
        cell: ({ row }) => <Typography variant='body2'>{`${dayjs(row.original?.paymentDate).format('DD/MM/YYYY')}`}</Typography>
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => <Typography variant='body2'>{`${row.original?.type}`}</Typography>
      }),
       columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton>
              <i className='tabler-refresh text-textSecondary' />
            </IconButton>
            
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <div className='overflow-x-auto'>
      <table className={tableStyles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-xl' />,
                          desc: <i className='tabler-chevron-down text-xl' />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {table?.getFilteredRowModel()?.rows?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                No data available
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className='border-be'>
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map(row => {
                return (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        )}
      </table>
    </div>
  )
}

const OrderPaymentDetailCard = ({orderData}) => {
  return (
    <Card>
      <CardHeader
        title='Details des paiements'
      />
      <Box sx={{px: 8, pb: 4}}>
        <OrderPayment orderData={orderData}/>
      </Box>
    </Card>
  )
}

export default OrderPaymentDetailCard

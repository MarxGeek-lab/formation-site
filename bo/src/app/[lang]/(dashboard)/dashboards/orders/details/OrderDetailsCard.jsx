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
import { Box, Chip } from '@mui/material'
import { statusLocObj, statusPayObj } from '@/data/constant'

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

const OrderTable = ({orderData}) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  
  useEffect(() => {
    setData(orderData?.items || [])
  }, [orderData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Produit',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* <img src={row.original.productImage} alt={row.original.productName} height={34} className='rounded' /> */}
            <div className='flex flex-col items-start'>
              <Typography color='text.primary' className='font-medium'>
                {row.original?.product?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Montant',
        cell: ({ row }) => <Typography>{`${formatAmount(row.original?.price || 0)}`} FCFA</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantité',
        cell: ({ row }) => <Typography>{`${row.original?.quantity}`}</Typography>
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => <Typography>{`${formatAmount(row.original?.quantity * row.original?.price || 0)}`} FCFA</Typography>
      })
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

const OrderDetailsCard = ({orderData}) => {
  return (
    <Card>
      <CardHeader
        title='Details du commande'
      />
      <Box sx={{px: 8, pb: 6}}>
        <Box className='flex flex-col gap-4 mb-8'>
          <div className='flex items-center gap-12'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Statut :
            </Typography>
          <Chip
            variant='tonal'
            label={statusLocObj[orderData?.status || '']?.text}
            color={statusLocObj[orderData?.status || '']?.color}
            size='small'
          />
        </div>
        <div className='flex items-center gap-12'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Statut de paiement :
          </Typography>
          <Chip
            variant='tonal'
            label={statusPayObj[orderData?.paymentStatus || '']?.text}
            color={statusPayObj[orderData?.paymentStatus || '']?.color}
            size='small'
          />
        </div>
        </Box>
        <OrderTable orderData={orderData}/>
      </Box>
      <CardContent className='flex justify-end'>
        <Box className='flex flex-col gap-2'>
          <div className='flex items-center gap-12'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Sous total :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {formatAmount(orderData?.items.reduce((total, item) => total + item.price * item.quantity, 0))} FCFA
            </Typography>
          </div>
          <div className='flex items-center gap-12'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Livraison:
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {orderData.shippingMethod?.fee === 0 ? 'Gratuit' : formatAmount(orderData?.shippingMethod?.fee || 0)+' FCFA'}
            </Typography>
          </div>
          <div className='flex items-center gap-12'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Taxe:
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {formatAmount(orderData?.totalAmount * orderData?.taxe / 100)} FCFA
            </Typography>
          </div>
          <div className='flex items-center gap-12'>
            <Typography color='text.primary' className='font-medium min-is-[100px]'>
              Total:
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {orderData?.totalAmount} FCFA
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  )
}

export default OrderDetailsCard

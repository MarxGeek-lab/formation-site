'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

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
import AddCustomerDrawer from './AddCustomerDrawer'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Chip, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

export const paymentStatus = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}
export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  
  // Recherche par nom du client
  const customerName = row.original?.buyer?.name?.toLowerCase() || '';
  
  // Recherche par ID du client
  const customerId = "#"+row.original?.buyer?._id?.toString().slice(0, 6).toUpperCase() || '';

  return customerName.includes(searchValue) || customerId.includes(searchValue?.toUpperCase());
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position='start'>
          <SearchIcon />
        </InputAdornment>
      )
    }} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const CustomerListTable = ({ customerData }) => {
  // States
  const [customerUserOpen, setCustomerUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setData(customerData);
  },[customerData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('customer', {
        header: 'Customers',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row.original?.picture, customer: row.original?.name })}
            <div className='flex flex-col items-start'>
              <Typography
                component={Link}
                color='text.primary'
                href={getLocalizedUrl(`/dashboards/customers/details/${row.original?._id}`, locale)}
                className='font-medium hover:text-primary'
              >
                {row.original?.name}
              </Typography>
              {/* <Typography variant='body2'>{row.original?.buyer?.email}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('customerId', {
        header: 'Customer Id',
        cell: ({ row }) => <Typography variant='body2' color='text.primary'>USER-{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
      }),
      columnHelper.accessor('email  ', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Typography className='max-w-[200px]' style={{whiteSpace: 'wrap'}}>
              {row.original?.email}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('order', {
        header: 'Nombre de commandes',
        cell: ({ row }) => <Chip 
          label={row.original.ordersCount || 0} 
          color='primary' 
          variant='contained' 
          size='medium' 
        />,
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Button href={`/${locale}/dashboards/customers/details/${row.original?._id}`}>
              <i className='tabler-eye'></i>
            </Button>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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

  const getAvatar = params => {
    const { avatar, customer } = params

    return <CustomAvatar src={avatar} skin='light' size={34} />
  }

  return (
    <>
      <Typography variant='h5' className='mb-4'>Liste des clients</Typography>
      <Card>
        <CardContent className='flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4'>
          <div className='flex max-sm:flex-col items-start sm:items-center justify-end gap-4 max-sm:is-full'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Rechercher par nom ou ID du client'
              className='max-sm:is-full w-[350px]'
            />
           {/*  <Button
              variant='tonal'
              className='max-sm:is-full'
              color='secondary'
              startIcon={<i className='tabler-upload' />}
            >
              Export
            </Button>
            <Button
              variant='contained'
              color='primary'
              className='max-sm:is-full'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setCustomerUserOpen(!customerUserOpen)}
            >
              Add Customer
            </Button> */}
          </div>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead style={{ backgroundColor: '#F5F5F5' }}>
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
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
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <AddCustomerDrawer
        open={customerUserOpen}
        handleClose={() => setCustomerUserOpen(!customerUserOpen)}
        setData={setData}
        customerData={data}
      />
    </>
  )
}

export default CustomerListTable

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
import Chip from '@mui/material/Chip'
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
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import dayjs from 'dayjs'
import { statusValidateTab } from '@/data/constant'
import { formatAmount } from '@/utils/formatAmount'

export const paymentStatus = {
  1: { text: 'Paid', color: 'success', colorClassName: 'text-success' },
  2: { text: 'Pending', color: 'warning', colorClassName: 'text-warning' },
  3: { text: 'Cancelled', color: 'secondary', colorClassName: 'text-secondary' },
  4: { text: 'Failed', color: 'error', colorClassName: 'text-error' }
}
export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

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

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const OrderListTable = ({ orderData }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [byStatus, setByStatus] = useState('tout')

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    const filtered = byStatus !== 'tout' ?
      orderData.filter(item => item.status.toLowerCase() === byStatus.toLowerCase())
      :orderData;
   
    setData(filtered)
  }, [orderData, byStatus]);

  const statusValidate = {
    pending: { title: 'En attente', color: 'warning', value: 'pending' },
    completed: { title: 'Terminé', color: 'success', value: 'completed' },
    progress: { title: 'En cours', color: 'success', value: 'progress' },
    cancelled: { title: 'Annulé', color: 'error', value: 'cancelled' }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('order', {
        header: 'Propriété',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <img src={row.original.property?.photos[0]} width={60} height={60} className='rounded bg-actionHover' />
            <div className='flex flex-col'>
              <Typography variant='body2'>LOC-{row.original?._id}</Typography>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.property?.name}
              </Typography>
              {["Chambre à louer", "Appartements", "Studio", "Maison", "Villa", 'Bureau', 'Local commercial'].includes(row.original?.property?.category) && (
                <Typography variant='body2'>{row.original?.property?.location?.city+", "+row.original?.property?.location?.district+", "+row.original?.property?.location?.address}</Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('amount', {
        header: 'Montant ( F CFA )',
        cell: ({ row }) => (
          <Typography>{formatAmount(row.original?.totalAmount || 0)}</Typography>
        )
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <div className='flex column gap-1' style={{flexDirection: 'column'}}>
            <div className='flex gap-3'>
              <Typography>début:</Typography>
              <Typography fontWeight={600} fontSize={13}>{dayjs(row.original?.startDate).format('DD/MM/YYYY HH-mm-ss')}</Typography>
            </div>
            <div className='flex gap-3'>
              <Typography>fin:</Typography>
              <Typography fontWeight={600} fontSize={13}>{dayjs(row.original?.endDate).format('DD/MM/YYYY HH-mm-ss')}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={statusValidate[row.original?.status]?.title}
            color={statusValidate[row.original?.status]?.color}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Button href={`/${locale}/dashboards/rental/details/${row.original?._id}`}>
              <i className='tabler-eye'></i>
            </Button>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
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
        pageSize: 5
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

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(customer || "User")}
        </CustomAvatar>
      )
    }
  }

  return (
    <Card>
      <CardContent className='flex justify-between max-sm:flex-col sm:items-center gap-4'>
        <div className="flex items-center gap-4">
          <Typography>Afficher</Typography>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px] max-sm:is-full'
          >
            <MenuItem value='5'>5</MenuItem>
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
            <MenuItem value='100'>100</MenuItem>
          </CustomTextField>
        </div>

        <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          <CustomTextField
            select
            value={byStatus}
            onChange={e => setByStatus(e.target.value)}
            className='is-[100px] max-sm:is-full'
          >
            {statusValidateTab.map((item, index) => (
              <MenuItem value={item.value} key={index}>{item.title}</MenuItem>
            ))}
          </CustomTextField>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Rechercher une location'
            className='is-[200px]'
          />
        </div>
      </CardContent>
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
  )
}

export default OrderListTable

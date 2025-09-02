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
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'

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
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatAmount } from '@/utils/formatAmount'
import { statusPayTab } from '@/data/constant'
import dayjs from 'dayjs'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  
  // Recherche par ID
  const id = row.original?._id?.toLowerCase() || '';
  
  // Recherche par nom du bien
  const propertyName = row.original?.reservation?.property?.name?.toLowerCase() || '';
  
  // Recherche par nom et email du client
  const clientName = row.original?.buyer?.name?.toLowerCase() || '';
  const clientEmail = row.original?.buyer?.email?.toLowerCase() || '';
  
  // Recherche par montant
  const amount = row.original?.amount?.toString()?.toLowerCase() || '';

  return id.includes(searchValue) || 
         propertyName.includes(searchValue) || 
         clientName.includes(searchValue) || 
         clientEmail.includes(searchValue) || 
         amount.includes(searchValue);
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

const InvoiceListTable = ({ paymentsData }) => {
  // States
  const [status, setStatus] = useState('tout')
  const [typePay, setTypePay] = useState('tout')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()
  
  useEffect(() => {
    let filtered = status && status !== 'tout' ?
      paymentsData.filter(item => item?.status?.toLowerCase() === status.toLowerCase())
      : paymentsData;
    
    if (typePay && typePay !== 'tout') {
      filtered = filtered.filter(item => item.transactionType.toLowerCase() === typePay);
    }

    setData(filtered)
  }, [paymentsData, status]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => {
          return (
            <Typography variant='body2'>
              #{row.original?._id.toString().slice(0, 6).toUpperCase()}
            </Typography>
          );
        }
      }),
      columnHelper.accessor('productName', {
        header: 'ID Commande',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Typography variant='body2'>
              ORD-{row.original?.order._id?.slice(0, 6).toUpperCase()}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'Client',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row.original?.customer?.picture, name: row.original?.customer?.name })}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.customer.name}
              </Typography>
              <Typography variant='body2'>{row.original?.customer?.email}</Typography>
            </div>
          </div>
        )
      }),
      // columnHelper.accessor('type', {
      //   header: 'Type',
      //   cell: ({ row }) => (
      //     <Chip
      //       label={row.original?.type === 'refundCancelation' ? 'Annulation' : 'Réservation'}
      //       variant='tonal'
      //       color={row.original?.type === 'refundCancelation' ? 'warning' : 'primary'}
      //       size='small'
      //     />
      //   )
      // }),
      columnHelper.accessor('total', {
        header: 'Montant',
        cell: ({ row }) => <Typography>{`${formatAmount(row.original?.amount || 0)}`} FCFA</Typography>
      }),
      columnHelper.accessor('issuedDate', {
        header: 'Date de paiement',
        cell: ({ row }) => <Typography variant='body2'>{dayjs(row.original.createdAt).locale('fr').format("DD/MM/YYYY HH:mm:ss")}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: ({ row }) => (
          <Chip
              label={statusObj[row.original?.status]?.title}
              variant='tonal'
              color={statusObj[row.original?.status]?.color}
              size='small'
            />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton>
              <Link href={getLocalizedUrl(`/dashboards/payments/details/${row.original._id}`, locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton>
            
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
        pageSize: 6
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
    const { avatar, name } = params

    return <CustomAvatar src={avatar} skin='light' size={34} />
  }

  const statusObj = {
    pending: { title: 'En cours', color: 'warning' },
    failed: { title: 'Annulé', color: 'error'},
    success: { title: 'Terminé', color: 'success' },
    refunded: { title: 'Remboursement', color: 'info' }
  }

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        {/* <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>
          <Button
            variant='contained'
            component={Link}
            startIcon={<i className='tabler-plus' />}
            href={getLocalizedUrl('/dashboards/payments/invoice/add', locale)}
            className='max-sm:is-full'
          >
            Create Invoice
          </Button>
        </div> */}
        <div className='flex w-full flex-wrap sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Typography variant='h6' fontSize={16} className='mr-3' whiteSpace='nowrap'>Filtrer par</Typography>
            <CustomTextField
              select
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              className='max-sm:is-full sm:is-[130px]'
              slotProps={{
                select: { displayEmpty: true }
              }}
            >
              <MenuItem defaultChecked value='tout'>Filtrer par statut</MenuItem>
              {statusPayTab.map((item, index) => (
                <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
              ))}
            </CustomTextField>
          </div>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Rechercher un paiement'
            className='max-sm:is-full w-[350px]'
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
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default InvoiceListTable

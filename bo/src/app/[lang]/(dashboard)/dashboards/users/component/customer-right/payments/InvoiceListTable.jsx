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
import dayjs from '@/configs/dayjs.config';
import { statusPayTab } from '@/data/constant'

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

// Vars
const invoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler-send-2' },
  Paid: { color: 'success', icon: 'tabler-check' },
  Draft: { color: 'primary', icon: 'tabler-mail' },
  'Partial Payment': { color: 'warning', icon: 'tabler-chart-pie-2' },
  'Past Due': { color: 'error', icon: 'tabler-alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler-arrow-down' }
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

  const type = {
    rental: { title: "Location", color: "warning"},
    sale: { title: "Vente", color: "primary"},
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Propriété',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <img src={row.original?.property?.photos[0]} width={60} height={60} className='rounded bg-actionHover' />
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.property.name}
              </Typography>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.property?.category}
              </Typography>
              {["Chambre à louer", "Appartements", "Studio", "Maison", "Villa", 'Bureau', 'Local commercial'].includes(row.original?.property?.category) && (
                <Typography variant='body2'>{row.original?.property?.location?.city+", "+row.original?.property?.location?.district+", "+row.original?.property?.location?.address}</Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'Client',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row.original?.buyer?.picture, name: row.original?.buyer?.name })}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original?.buyer.name}
              </Typography>
              <Typography variant='body2'>{row.original?.buyer?.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('total', {
        header: 'Montant ( F CFA )',
        cell: ({ row }) => <Typography>{`${formatAmount(row.original?.amount || 0)}`}</Typography>
      }),
      /* columnHelper.accessor('issuedDate', {
        header: 'Date de paiement',
        cell: ({ row }) => <Typography variant='body2'>{dayjs(row.original.createdAt).locale('fr').format("DD/MM/YYYY HH:mm:ss")}</Typography>
      }), */
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
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => (
          <Chip
              label={type[row.original?.transactionType]?.title}
              variant='tonal'
              color={type[row.original?.transactionType]?.color}
              size='small'
            />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
        {/*     <IconButton onClick={() => setData(data?.filter(invoice => invoice.id !== row.original.id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton> */}
           {/*  <IconButton>
              <Link href={getLocalizedUrl(`/apps/invoice/preview/${row.original.id}`, locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton> */}
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'détails',
                  icon: 'tabler-eye',
                  href: getLocalizedUrl(`/dashboards/payments/details/${row.original._id}`, locale),
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-4 gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Télécharger la facture',
                  icon: 'tabler-download',
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-4 gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Envoyer la facture',
                  icon: 'tabler-send',
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-4 gap-2 text-textSecondary'
                  }
                }
              ]}
            />
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
    const { avatar, name } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(name)}
        </CustomAvatar>
      )
    }
  }

  const statusObj = {
    pending: { title: 'En cours', color: 'warning' },
    failed: { title: 'Annulé', color: 'error'},
    completed: { title: 'Terminé', color: 'success' },
    refunded: { title: 'Remboursement', color: 'info' }
  }


  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>
          <div className='flex items-center gap-2 is-full sm:is-auto'>
            <Typography className='hidden sm:block'>Afficher</Typography>
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
            </CustomTextField>
          </div>
        </div>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='max-sm:is-full sm:is-[100px]'
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            {statusPayTab.map((item, index) => (
              <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
            ))}
          </CustomTextField>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Rechercher un paiement'
            className='max-sm:is-full sm:is-[200px]'
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

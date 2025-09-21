'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { Box, CardContent, Chip, InputAdornment, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'

import tableStyles from '@core/styles/table.module.css'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { formatAmount } from '@/utils/formatAmount'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])
  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  )
}

const columnHelper = createColumnHelper()

const ActivityHistoryTable = ({ activities }) => {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedAffiliate, setSelectedAffiliate] = useState('all')
  const [affiliates, setAffiliates] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    setData(activities || [])

    if (activities?.length > 0) {
      // Supposons que chaque affiliate a un id unique
      const uniqueAffiliatesMap = new Map();

      activities.forEach(activity => {
        const affiliate = activity.affiliate;
        if (affiliate && !uniqueAffiliatesMap.has(affiliate.id)) {
          uniqueAffiliatesMap.set(affiliate.id, affiliate);
        }
      });

      const uniqueAffiliates = Array.from(uniqueAffiliatesMap.values());
      setAffiliates(uniqueAffiliates);
    }

    const filteredData = activities.filter(activity => {
      if (selectedAffiliate === 'all') return true
      return activity.affiliate._id === selectedAffiliate
    })
    setData(filteredData)

    const totalEarnings = filteredData.reduce((acc, p) => p.status === "paid" ? acc + p.amount : acc, 0);
    setEarnings(totalEarnings);

  }, [activities, selectedAffiliate])

  const columns = useMemo(() => [
    columnHelper.accessor('affiliate', {
      header: 'Affilié',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Typography variant='subtitle1' fontWeight='bold'>Code : {row.original.affiliate?.refCode || '-'}</Typography>
          <Typography variant='body2'>{row.original.affiliate?.user?.name || '-'}</Typography>
          <Typography variant='body2'>{row.original.affiliate?.user?.email || '-'}</Typography>
        </div>
      )
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Typography variant='body2'>{row.original.type === 'order' ? 'Commande' : 'Inscription'}</Typography>
        </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Chip 
            variant='body2'
            size='small'
            label={row.original.status === 'pending' ? 'En attente' : 'Validé'}
            color={row.original.status === 'pending' ? 'warning' : 'success'}
          />
        </div>
      )
    }),
    columnHelper.accessor('amount', {
      header: 'Montant de vente',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Typography variant='body2'>{row.original.amount || '0'} FCFA</Typography>
        </div>
      )
    }),
    columnHelper.accessor('commissionAmount', {
      header: 'Commission',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Typography variant='body2'>{row.original.commissionAmount || '0'} FCFA</Typography>
        </div>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <Typography variant='body2'>{new Date(row.original.createdAt).toLocaleDateString()}</Typography>
        </div>
      )
    })
  ], [data])

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 8 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <Typography variant='h5' className='mb-5'>Historique des activités</Typography>

      <Card>
        <CardContent>
          <Typography variant='subtitle1' mb={2}>Filtrer par affilié</Typography>
            <CustomTextField
              select
              id='select-status'
              value={selectedAffiliate}
              onChange={e => setSelectedAffiliate(e.target.value)}
              slotProps={{
                select: { displayEmpty: true }
              }}
              className='w-[250px] text-sm'
            >
              <MenuItem value='all'>Tout</MenuItem>
              {affiliates?.map((affiliate, index) => (
                <MenuItem key={index} value={affiliate._id}>{affiliate?.user?.name}</MenuItem>
              ))}
            </CustomTextField>

          <Card sx={{
            background: '#5F3AFC', 
            boxShadow: 'none',
            border: '1px solid rgb(207, 207, 207)',
            borderBottom: '2px solid #5F3AFC',
            width: '250px',
            mt: 2
          }}>
            <CardContent className=' h-[100px] flex items-center justify-between gap-2'>
              <div className='flex flex-col items-start gap-1'>
                <Typography variant='h6' color="white" whiteSpace={'nowrap'}>
                  {formatAmount(earnings || 0)} FCFA</Typography>
                <Typography fontSize={14} className="mt-2" color="white" whiteSpace={'nowrap'}>
                  Total des ventes
                </Typography>
              </div>
              <CustomAvatar color='#ffffff02' skin='#ffffff02'  variant='rounded' size={42}>
                <i className={"tabler-wallet"} style={{ color: '#5F3AFC' }} />
              </CustomAvatar>
            </CardContent>
          </Card>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead style={{ backgroundColor: '#F5F5F5' }}>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {header.isPlaceholder ? null : (
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
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-4'>Aucune donnée disponible</td>
                </tr>
              ) : (
                table.getRowModel().rows.slice(0, table.getState().pagination.pageSize).map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='px-6 py-4 whitespace-nowrap'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
    </>
  )
}

export default ActivityHistoryTable

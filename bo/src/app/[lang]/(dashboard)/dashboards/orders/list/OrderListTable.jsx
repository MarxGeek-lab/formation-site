'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
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
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatAmount } from '@/utils/formatAmount'
import { API_URL_ROOT } from '@/settings'
import { usePropertyStore } from '@/contexts/PropertyStore'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { Badge, Icon, IconButton, InputAdornment } from '@mui/material'
import dayjs from 'dayjs'
import { getInitials } from '@/utils/getInitials'
import SearchIcon from '@mui/icons-material/Search';

export const paymentStatus = {
  paid: { text: 'Payé', color: 'success', colorClassName: 'text-success' },
  pending: { text: 'En attente', color: 'warning', colorClassName: 'text-warning' },
  unpaid: { text: 'En attente', color: 'warning', colorClassName: 'text-warning' },
  cancelled: { text: 'Annulé', color: 'secondary', colorClassName: 'text-secondary' },
  failed: { text: 'Echoué', color: 'error', colorClassName: 'text-error' },
  partiallyPaid: { text: 'Partiellement payé', color: 'warning', colorClassName: 'text-warning' }
}

export const ordersStatus = {
  delivered: { color: 'success', text: 'Délivré' },
  pending: { color: 'warning', text: 'En attente' },
  confirmed: { color: 'success', text: 'Confirmé' },
  shipped: { color: 'warning', text: 'Envoi' },
  cancelled: { color: 'error', text: 'Annulé' }
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  const name = row.original?.customer?.name?.toLowerCase() || '';
  const id = "ORD-"+row.original?._id?.toString().slice(0, 6).toUpperCase() || '';

  return name.includes(searchValue) || id.includes(searchValue.toUpperCase());
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue);

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

const OrderListTable = ({ orderData, showHeader }) => {
  // States
  const { deleteProperty } = usePropertyStore();
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState(orderData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showDialog, setShowDialog] = useState(false);

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setFilteredData(orderData);
  }, [orderData]);

  console.log(orderData)
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID Commande',
        cell: ({ row }) => (
          <div className='flex items-center gap-4' style={{ width: '' }}>
            <Typography variant='body1'>ORD-{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('id', {
        header: 'Type',
        cell: ({ row }) => (
          <div className='flex items-center gap-4' style={{ width: '' }}>
            <Typography variant='body1'>
              <Chip 
              label={row.original?.typeOrder} 
              color={row.original?.typeOrder === 'abonnement' ? 'primary' : 'success'} />
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('product', {
        header: 'Product',
        cell: ({ row }) => (
          <div className='flex items-center gap-4' style={{ width: '' }}>
            <Typography variant='body1'>
              {row.original.typeOrder === "achat" ? row.original?.items?.map(item => (
                <Typography variant='body2' className='font-medium' color='text.primary'>
                  {item?.product?.name}
                </Typography>
              )): (
                <Typography variant='body2' className='font-medium' color='text.primary'>
                  {row?.original?.items?.[0]?.subscription?.title}
                </Typography>
              )}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('customers', {
        header: 'Client',
        cell: ({ row }) => (
          <div className='flex items-center gap-4' style={{ width: '180px' }}>
            {getAvatar({ avatar: row.original?.customer?.picture, name: row.original?.customer?.name })}
            <div className='flex flex-col'>
              <Typography variant='body2' className='font-medium' color='text.primary'>
                {row.original?.customer?.name}
              </Typography>
              {/* <Typography variant='body2'>{row.original?.customer?.email}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Montant total',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col gap-1'>
              <Typography>
                {formatAmount(row.original?.totalAmount)} FCFA
              </Typography>
            </div>
          );
        }
      }),
      columnHelper.accessor('payment', {
        header: 'Paiement',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <i
              className={classnames(
                'tabler-circle-filled bs-2.5 is-2.5',
                paymentStatus[row.original?.paymentStatus]?.colorClassName
              )}
            />
            <Typography color={`${paymentStatus[row.original?.paymentStatus]?.color}.main`} className='font-medium'>
              {paymentStatus[row.original?.paymentStatus]?.text}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('statuss', {
        header: 'Status',
        cell: ({ row }) => (
        <Chip
            label={ordersStatus[row.original?.status]?.text}
            variant='filled'
            color={ordersStatus[row.original?.status]?.color}
            size='small'
          /> 
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date de Création',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {dayjs(row.original?.createdAt).format('DD/MM/YYYY HH:mm:ss')} 
          </Typography>
        )
      }),
      columnHelper.accessor('statuss', {
        header: 'Origine',
        cell: ({ row }) => (
        <Chip
            label={row.original?.fromOrder === "from admin" ? "admin" : "site"}
            variant='outlined'
            color={row.original?.fromOrder === "from admin" ? "primary" : "success"}
            size='small'
          /> 
        )
      }),
     columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          
          <div className='flex items-center'>
            <IconButton
              size='small'
              onClick={() => window.location.href = `/${locale}/dashboards/orders/details/${row.original._id}`}
            > 
            <i className='tabler-eye'></i>
            </IconButton>
          </div>
        ),
        enableSorting: false
      }) 
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData]
  );

  const handleDelecteProperty = async () => {
    let id = sessionStorage.getItem("_productId") || '';
    if (id) {
      setShowDialog(false);
        showLoader();

        try {
            const res = await deleteProperty(id);
            hideLoader();
            if (res) {
                if (res === 200) {
                    sessionStorage.removeItem("_productId");
                    showToast("La suppression a réussie !", "success", 5000);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    showToast("Erreur Inconnue! Veuillez réessayer", "error", 5000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
  }

  const table = useReactTable({
    data: filteredData,
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

  return (
    <>
      <Card className='p-0'>
        <Divider />
        {showHeader && (
          <div className='flex flex-wrap justify-between xs:justify-start gap-4 p-6'>
            <TableFilters setData={setFilteredData} ordersData={orderData} />
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                placeholder='Rechercher par Id...'
                className='w-[350px] max-sm:w-full'
              />
          </div>
        )}
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead style={{background: '#f5f5f5'}}>
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
                              userSelect: 'none',
                              fontWeight: 'bold',
                              transition: 'background-color 0.2s ease-in-out',
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {/* {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null} */}
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
                    Aucune donnée disponible
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row, index) => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} style={{ padding: '20px' }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        {showHeader && (
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        )}
      </Card>
    </>
  )
}

export default OrderListTable

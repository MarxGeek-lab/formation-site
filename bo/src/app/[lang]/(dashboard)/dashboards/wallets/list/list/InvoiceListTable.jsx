'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'

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
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatAmount } from '@/utils/formatAmount'
import { statusPayTab2 } from '@/data/constant'
import AddDrawer from '../../add/AddDrawer'
import { useWalletStore } from '@/contexts/WalletContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { useParams } from 'next/navigation'
import OptionMenu from '@/@core/components/option-menu'
import { getLocalizedUrl } from '@/utils/i18n'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  
  // Recherche par ID
  const id = "WTH-"+row.original?._id?.toString().slice(0, 6).toUpperCase() || '';

  // Recherche par montant (avec et sans formatage)
  const amount = row.original?.amount?.toString()?.toLowerCase() || '';
  const formattedAmount = formatAmount(row.original?.amount || 0)?.toLowerCase() || '';
  
  // Recherche par réseau (méthode de paiement)
  const method = row.original?.method?.toLowerCase() || '';
  
  // Recherche par numéro
  const number = row.original?.numberWithdraw?.toLowerCase() || '';

  return id.includes(searchValue.toUpperCase()) || 
         amount.includes(searchValue) || 
         formattedAmount.includes(searchValue) || 
         method.includes(searchValue) || 
         number.includes(searchValue);
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);

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

const InvoiceListTable = ({ statsSold, requestsData, fetchWallet }) => {
  // States
  const {deleteWallet} = useWalletStore();
  const [status, setStatus] = useState('tout')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  const [addRequestOpen, setAddRequestOpen] = useState(false)
  const [request, setRequest] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

   const { lang: locale } = useParams()

  useEffect(() => {
    let filtered = status && status !== 'tout' ?
      requestsData.filter(item => item?.status?.toLowerCase() === status.toLowerCase())
      : requestsData;
    console.log(filtered)
    setData(filtered)
  }, [requestsData, status]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => {
          return (
            <Typography variant='body2'>
              WTH-{row.original?._id?.toString().slice(0, 6).toUpperCase()}
            </Typography>
          );
        }
      }),
      columnHelper.accessor('amount', {
        header: 'Montant demandé ( F CFA )',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Typography className='font-medium' color='text.primary'>
              {formatAmount(row.original?.amount)}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('method', {
        header: 'Méthode de paiement',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Typography className='font-medium' color='text.primary'>
              {row.original?.method}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('phone', {
        header: 'Numéro de réception',
        cell: ({ row }) => <Typography className='font-medium' color='text.primary'>
            {row.original?.numberWithdraw}
          </Typography>
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
     /*  columnHelper.accessor('date', {
        header: 'Soumis le',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {daysjs(row.original?.createdAt).locale('fr').format('DD/MM/YYYY HH:mm:ss')}
          </Typography>
        )
      }),
      columnHelper.accessor('date2', {
        header: 'Traité le',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original?.processedAt ? daysjs(row.original?.processedAt).locale('fr').format('DD/MM/YYYY HH:mm:ss'):'--'}
          </Typography>
        )
      }), */
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Button
              onClick={() => {
                window.location.href = getLocalizedUrl(`/dashboards/wallets/details/${row.original._id}`, locale)
              }}
              className='w-[24px] h-6'
              size='small'
            >
              <span className='tabler-eye text-primary size-6'></span>
            </Button>
            <Button
              onClick={() => {
                setAddRequestOpen(!addRequestOpen);
                setRequest(requestsData?.find(request => request?._id === row.original?._id))
              }}
              className='w-[24px] h-6'
              size='small'
            >
              <span className='tabler-edit text-warning size-6'></span>
            </Button>

            <Button
              onClick={() => {
                setShowDialog(true);
                setRequest(requestsData?.find(request => request?._id === row.original?._id))
              }}
              className='w-[24px] h-6'
              size='small'
            >
              <span className='tabler-trash text-error size-6'></span>
            </Button>

            
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  // text: 'détails',
                  icon: 'tabler-eye',
                  href: getLocalizedUrl(`/dashboards/wallets/details/${row.original._id}`, locale),
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-4 gap-2 text-textSecondary'
                  }
                },
               {
                  // text: 'Modifier',
                  icon: 'tabler-edit text-warning',
                  onClick: () => {
                    setAddRequestOpen(!addRequestOpen);
                    setRequest(requestsData?.find(request => request?._id === row.original?._id));
                  }
                },
                 {
                  // text: 'Envoyer la facture',
                  icon: 'tabler-trash text-error',
                  onClick: () => {
                    setShowDialog(true);
                    setRequest(requestsData?.find(request => request?._id === row.original?._id))
                  }
                } 
              ]}
            />  */}
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

  const statusObj = {
    pending: { title: 'En cours', color: 'warning' },
    failed: { title: 'Annulé', color: 'error'},
    completed: { title: 'Terminé', color: 'success' },
    refunded: { title: 'Remboursement', color: 'info' },
    approved: { title: 'Approuvé', color: 'primary' },
    rejected: { title: 'Rejeté', color: 'error'},
    paid: { title: 'Payé', color: 'success' }
  }

  const handleDelete = async () => {
    if (request) {
      showLoader();

      try {
        const res = await deleteWallet(request?._id);
        hideLoader();

       if (res === 200) {
          fetchWallet();
          setRequest(null)
          showToast('Demande de retrait supprimé avec succès!', 'success', 5000);
        }
        else if (res === 400) {
          showToast('Cette demande a été déjà traité. Vous ne pouvez plus le supprimé.', 'error', 5000);
        } else if (res === 404) {
          showToast('Cette demande n\'existe pas.', 'error', 5000);
        } else {
          showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  return (
    <Card>
      {showDialog && (
        <ConfirmationDialog
          title={"Confirmation"}
          message={"Voulez-vous vraiment supprimé la demande ?"}
          onConfirm={handleDelete}
          onCancel={() => setShowDialog(false)}
          />
      )}
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
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>
        </div>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <Button
            variant='contained'
            className='max-sm:is-full'
            onClick={() => setAddRequestOpen(!addRequestOpen)}
            startIcon={<i className='tabler-plus' />}
            >
            Effectuer un retrait
          </Button>
          <CustomTextField
            select
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='max-sm:is-full sm:is-[160px]'
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            {statusPayTab2.map((item, index) => (
              <MenuItem value={item.value} key={index}>{item.text}</MenuItem>
            ))}
          </CustomTextField>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Rechercher par ID, montant, réseau ou numéro'
            className='max-sm:is-full sm:is-[250px]'
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
       <AddDrawer
        open={addRequestOpen}
        requestData={request}
        setData={setData}
        handleClose={() => setAddRequestOpen(!addRequestOpen)}
        fetchWallet={fetchWallet}
        setRequest={setRequest}
        statsSold={statsSold}
      />
    </Card>
  )
}

export default InvoiceListTable

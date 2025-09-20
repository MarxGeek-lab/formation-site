'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
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
import AddCategoryDrawer from './AddCategoryDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { API_URL_ROOT } from '@/settings'
import { Chip, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { useSubscriptionContext } from '@/contexts/SubscriptionContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import SearchIcon from '@mui/icons-material/Search'
import { usePropertyStore } from '@/contexts/PropertyStore'
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
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }} />
}


// Column Definitions
const columnHelper = createColumnHelper()

const ProductCategoryTable = ({ fetchSubscription, allSubscriptions }) => {
  // States
  const { deleteSubscription, publishOrUnpublishSubscription } = useSubscriptionContext();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [msg, setMsg] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState('');
  const [action, setAction] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id);
    setSubscription(t);
    setAddCategoryOpen(true);
  }

  useEffect(() => {
    setData(allSubscriptions)
  },[allSubscriptions]);
console.log(allSubscriptions)
  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Abonnement',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2' color='text.primary'>#{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
              <Typography variant='body2' color='text.primary'>
                {row.original?.title}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='flex items-center gap-3' style={{ whiteSpace: 'pre-wrap', width: '200px' }}>
            <Typography variant='body2' color='text.primary'>
              {row.original?.description}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Prix',
        cell: ({ row }) => (
          <div>
            <Typography variant='body2' color='text.primary'>
              {row.original?.price} FCFA
            </Typography>
            <Typography variant='body2' color='text.primary'>
              {row.original?.priceEUR} €
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('duration', {
        header: 'Durée',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {row.original?.duration}
          </Typography>
        )
      }),
      columnHelper.accessor('features', {
        header: 'Caractéristiques',
        cell: ({ row }) => (
          <div className='flex flex-wrap items-center gap-2'>
            {row.original?.features?.map((feature, index) => (
              <Chip 
                key={index}
                label={feature}
                color='primary'
                variant='tonal'
                size='small'
              />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('product', {
        header: 'Produit lié',
        cell: ({ row }) => (
        <div className='flex flex-wrap items-center gap-2'>
          {row.original?.relatedProducts?.map((item, index) => (
            <Chip 
            key={index}
            label={item.name}
            color='secondary'
            variant='tonal'
            size='small'
          />
          ))}
        </div>        
        )
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {dayjs(row.original?.createdAt).format('DD/MM/YYYY')}
          </Typography>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleEdit(row.original?._id)}>
              <i className='tabler-edit text-warning' />
            </IconButton>
            <IconButton onClick={() => handleDelete(row.original)}>
              <i className='tabler-trash text-error' />
            </IconButton>
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
        pageSize: 8
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

  const handleDelete = (data) => {
    setMsg('Voulez-vous vraiment supprimer cet abonnement');
    setAction(1);
    setShowDialog(true);
    setSubscriptionData(data);
  }

  const handleUpdate = (data) => {
    setMsg(`Voulez-vous vraiment ${data?.isPublished ? 'dépublier':'publier'} cet abonnement`);
    setAction(2);
    setShowDialog(true);
    setSubscriptionData(data);
  }

  const handleAction = async () => {
    showLoader()
    setShowDialog(false);
    try {
      let res;
      if (action === 1) {
        res = await deleteSubscription(subscriptionData?._id);
      } else if (action === 2) {
        res = await publishOrUnpublishSubscription(subscriptionData?._id)
      }
      hideLoader();

      if (res === 200) {
        fetchSubscription();
        setSubscriptionData(null);

        if (action === 1) {
          showToast('Abonnement supprimé !', 'success', 5000);
        } else if (action === 2) {
          showToast(`Abonnement ${subscriptionData?.isPublished ? 'dépublié':'publié'} avec succès.`, 'success', 5000);
        }
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer', 'error', 5000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Typography variant='h5' className='mb-5'>Liste des abonnements</Typography>
       {showDialog && (
        <ConfirmationDialog
          title="Confirmation"
          message={msg}
          onConfirm={handleAction}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <Button
            variant='contained'
            onClick={() => setAddCategoryOpen(!addCategoryOpen)}
            startIcon={<i className='tabler-plus' />}
          >
            Ajouter
          </Button>
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Rechercher'
              className='max-sm:is-full w-[350px]'
            />
          </div>
        </div>
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
      <AddCategoryDrawer
        open={addCategoryOpen}
        subscriptionData={subscription}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
        fetchSubscription={fetchSubscription}
        setSubscriptionData={setSubscription}
      />
    </>
  )
}

export default ProductCategoryTable

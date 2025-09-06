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
import AddCategoryDrawer from './AddPromoCodeDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { API_URL_ROOT } from '@/settings'
import { Chip, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { usePromoCodeStore } from '@/contexts/GlobalContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import SearchIcon from '@mui/icons-material/Search'

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

const ProductCategoryTable = ({ fetchPromoCodes, promoCodes }) => {
  // States
  const { deletePromoCode, updatePromoCode } = usePromoCodeStore();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('');
  const [promoCode, setPromoCode] = useState(null);
  const [msg, setMsg] = useState(null);
  const [promoCodeData, setPromoCodeData] = useState('');
  const [action, setAction] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id);
    setPromoCode(t);
    setAddCategoryOpen(true);
  }

  useEffect(() => {
    setData(promoCodes)
  },[promoCodes]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Code Promo',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2' color='text.primary' fontWeight='bold'>{row.original?.code}</Typography>
              {/* <Typography variant='caption' color='text.secondary'>#{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('discountType', {
        header: 'Type de Réduction',
        cell: ({ row }) => (
          <Chip 
            label={row.original?.discountType === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
            color={row.original?.discountType === 'percentage' ? 'primary' : 'secondary'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('discountValue', {
        header: 'Valeur',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary' fontWeight='medium'>
            {row.original?.discountType === 'percentage' 
              ? `${row.original?.discountValue}%` 
              : `${row.original?.discountValue}€`
            }
          </Typography>
        )
      }),
      columnHelper.accessor('usage', {
        header: 'Utilisation',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {row.original?.usedCount || 0}/{row.original?.maxUsage}
          </Typography>
        )
      }),
      columnHelper.accessor('expiresAt', {
        header: 'Expire le',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {new Date(row.original?.expiresAt).toLocaleDateString('fr-FR')}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: ({ row }) => {
          const now = new Date()
          const expiresAt = new Date(row.original?.expiresAt)
          
          if (!row.original?.isActive) {
            return <Chip label="Inactif" color="default" size="small" />
          } else if (expiresAt < now) {
            return <Chip label="Expiré" color="error" size="small" />
          } else if (row.original?.usedCount >= row.original?.maxUsage) {
            return <Chip label="Épuisé" color="warning" size="small" />
          } else {
            return <Chip label="Actif" color="success" size="small" />
          }
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleToggleStatus(row.original)}>
              <i className={`tabler-${row.original?.isActive ? 'eye-off':'eye'} text-primary`} />
            </IconButton>
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
    setMsg('Voulez-vous vraiment supprimer ce code promo ?');
    setAction(1);
    setShowDialog(true);
    setPromoCodeData(data);
  }

  const handleToggleStatus = (data) => {
    setMsg(`Voulez-vous vraiment ${data?.isActive ? 'désactiver':'activer'} ce code promo ?`);
    setAction(2);
    setShowDialog(true);
    setPromoCodeData(data);
  }

  const handleAction = async () => {
    showLoader()
    setShowDialog(false);
    try {
      let res;
      if (action === 1) {
        res = await deletePromoCode(promoCodeData?.code);
      } else if (action === 2) {
        res = await updatePromoCode(promoCodeData?._id, {isActive: !promoCodeData?.isActive})
      }
      hideLoader();

      if (res === 200) {
        fetchPromoCodes();
        setPromoCodeData(null);

        if (action === 1) {
          showToast('Code promo supprimé !', 'success', 5000);
        } else if (action === 2) {
          showToast(`Code promo ${promoCodeData?.isActive ? 'désactivé':'activé'} avec succès.`, 'success', 5000);
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
      <Typography variant='h5' className='mb-5'>Gestion des Codes Promo</Typography>
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
            Ajouter un Code Promo
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
                    Aucun code promo disponible
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
        promoCodeData={promoCode}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
        fetchPromoCodes={fetchPromoCodes}
        setPromoCodeData={setPromoCode}
      />
    </>
  )
}

export default ProductCategoryTable

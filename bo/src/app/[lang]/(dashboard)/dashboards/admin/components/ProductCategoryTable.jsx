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
import { useAdminStore } from '@/contexts/AdminContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import SearchIcon from '@mui/icons-material/Search'
import { permissionsArray2 } from '@/data/constant'

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

const ProductCategoryTable = ({ fetchAdmin, allAdmin }) => {
  // States
  const { deleteAdmin, updateStatusAdmin } = useAdminStore();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('');
  const [admin, setAdmin] = useState(null);
  const [msg, setMsg] = useState(null);
  const [adminData, setAdminData] = useState('');
  const [action, setAction] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id);
    setAdmin(t);
    setAddCategoryOpen(true);
  }

  useEffect(() => {
    setData(allAdmin)
  },[allAdmin]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('categoryTitle', {
        header: 'Utilisateur',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomAvatar
              skin='light'
              size={32}
            >
            </CustomAvatar>
            <div className='flex flex-col items-start'>
              <Typography variant='body2' color='text.primary'>#{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
              <Typography variant='body2' color='text.primary'>{row.original?.name}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1'>
           <Typography variant='body2' color='text.primary'>
            {row.original?.name}
          </Typography>
          <Typography variant='body2' color='text.primary'>
            {row.original?.email}
          </Typography>
          </div>
         
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Ajouter le',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {new Date(row.original?.createdAt).toLocaleDateString()}
          </Typography>
        )
      }),
      columnHelper.accessor('lastLogin', {
        header: 'dernière connexion',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            {new Date(row.original?.lastLogin).toLocaleString()}
          </Typography>
        )
      }),
      columnHelper.accessor('permission', {
        header: 'Permission',
        cell: ({ row }) => (
          <div className='flex flex-col gap-1'>
            {row.original?.permissions?.map(item => (
              <Chip 
                label={permissionsArray2.find(p => p.value === item)?.label}
                color='secondary'
                variant='tonal'
              />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip 
            label={row.original?.isActive ? 'Actif':'Inactif'}
            color={row.original?.isActive ? 'success':'error'}
            variant='tonal'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleUpdate(row.original)}>
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
    setMsg('Voulez-vous vraiment supprimer ce compte');
    setAction(1);
    setShowDialog(true);
    setAdminData(data);
  }

  const handleUpdate = (data) => {
    console.log(data)
    setMsg(`Voulez-vous vraiment ${data?.isActive ? 'désactivé':'activé'} ce compte`);
    setAction(2);
    setShowDialog(true);
    setAdminData(data);
  }

  const handleAction = async () => {
    showLoader()
    setShowDialog(false);
    try {
      let res;
      if (action === 1) {
        res = await deleteAdmin(adminData?._id);
      } else if (action === 2) {
        res = await updateStatusAdmin(adminData?._id, {isActive: !adminData?.isActive})
      }
      hideLoader();

      if (res === 200) {
        fetchAdmin();
        setAdminData(null);

        if (action === 1) {
          showToast('Compte supprimé !', 'success', 5000);
        } else if (action === 2) {
          showToast(`Compte ${adminData?.isActive ? 'désactivé':'activé'} avec succès.`, 'success', 5000);
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
      <Typography variant='h5' className='mb-5'>Liste des comptes</Typography>
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
        adminData={admin}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
        fetchAdmin={fetchAdmin}
        setAdminData={setAdmin}
      />
    </>
  )
}

export default ProductCategoryTable

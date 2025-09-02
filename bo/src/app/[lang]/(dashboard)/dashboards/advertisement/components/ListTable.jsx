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
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { API_URL_ROOT } from '@/settings'
import { Chip, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { useAnnoncesStore } from '@/contexts/GlobalContext'
import AddAnnonce from './AddAnnonce'

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

const ListTable = ({ fetchAnnonces, annonces }) => {
  // States
  const { updateAnnonceStatus, deleteAnnonce } = useAnnoncesStore();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('');
  const [annonce, setAnnonce] = useState(null);
  const [msg, setMsg] = useState(null);
  const [annonceData, setAnnonceData] = useState('');
  const [action, setAction] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id);
    setAnnonce(t);
    setAddCategoryOpen(true);
  }

  useEffect(() => {
    setData(annonces)
  },[annonces]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('subject', {
        header: 'Sujet',
        cell: ({ row }) => (
          <div className=' text-wrap'>
            <img src={row.original?.image} width={250}  className='rounded bg-actionHover' />
          </div>
        )
      }),
      columnHelper.accessor('typeuser', {
        header: 'destinataire',
        cell: ({ row }) => (
          <div className='flex flex-wrap gap-2'>
            {row.original?.typeUser?.map(item => (
              <Chip 
                label={item}
                color={'default'}
                variant='tonal'
              />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('create', {
        header: 'Créer le',
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original?.createdAt).toLocaleString()}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip 
            label={row.original?.statut === 'published' ? 'Publié':'Non publié'}
            color={row.original?.statut === 'published' ? 'success':'error'}
            variant='tonal'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleUpdate(row.original)}>
              <i className={`tabler-${row.original?.statut === 'published' ? 'eye-off':'eye'} text-primary`} />
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

  const handleDelete = (data) => {
    setMsg('Voulez-vous vraiment supprimer l\'annonce ?');
    setAction(1);
    setShowDialog(true);
    setAnnonceData(data);
  }

  const handleUpdate = (data) => {
    setMsg(`Voulez-vous vraiment ${data?.statut === 'published' ? 'dé-publier':'publier'} cet annonce ?`);
    setAction(2);
    setShowDialog(true);
    setAnnonceData(data);
  }

  const handleAction = async () => {
    showLoader()
    setShowDialog(false);
    try {
      let res;
      if (action === 1) {
        res = await deleteAnnonce(annonceData?._id);
      } else if (action === 2) {
        res = await updateAnnonceStatus(annonceData?._id, { statut: annonceData.statut === 'published' ? 'unPublished':'published' })
      }
      hideLoader();

      if (res === 200) {
        fetchAnnonces();
        
        if (action === 1) {
          showToast('Annonce supprimé !', 'success', 5000);
        } else if (action === 2) {
          showToast(`Annonce ${annonceData.statut === 'published' ? 'publié':'dé-publié'} avec succès.`, 'success', 5000);
        }
        setAnnonceData(null);
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer', 'error', 5000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
       {showDialog && (
        <ConfirmationDialog
          title="Confirmation"
          annonce={msg}
          onConfirm={handleAction}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <div className='flex items-center gap-4'>
            <Typography>Afficher</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto max-sm:is-full sm:is-[70px]'
            >
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='15'>15</MenuItem>
              <MenuItem value='25'>25</MenuItem>
            </CustomTextField>
          </div>
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <Button
              variant='contained'
              className='max-sm:is-full'
              onClick={() => setAddCategoryOpen(!addCategoryOpen)}
              startIcon={<i className='tabler-plus' />}
            >
              Ajouter
            </Button>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Rechercher'
              className='max-sm:is-full'
            />
          </div>
        </div>
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
      <AddAnnonce
        open={addCategoryOpen}
        annonceData={annonce}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
        fetchAnnonces={fetchAnnonces}
        setAnnonceData={setAnnonce}
      />
    </>
  )
}

export default ListTable

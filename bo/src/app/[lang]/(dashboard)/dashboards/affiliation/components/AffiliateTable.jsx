'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { Chip, InputAdornment, Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
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
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { useAdminAffiliationStore } from '@/contexts/GlobalContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import AddAffiliateDrawer from './AddAffiliateDrawer'

import tableStyles from '@core/styles/table.module.css'

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

const AffiliateTable = ({ fetchAffiliates, allAffiliates }) => {
  const { deleteAffiliate, updateStatusAffiliate } = useAdminAffiliationStore()

  const [addAffiliateOpen, setAddAffiliateOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [affiliate, setAffiliate] = useState(null)
  const [msg, setMsg] = useState(null)
  const [affiliateData, setAffiliateData] = useState('')
  const [action, setAction] = useState(0)
  const [showDialog, setShowDialog] = useState(false)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState(null)

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id)
    setAffiliate(t)
    setAddAffiliateOpen(true)
  }

  const handleView = (affiliate) => {
    setSelectedAffiliate(affiliate)
    setViewDialogOpen(true)
  }

  useEffect(() => {
    setData(allAffiliates)
  }, [allAffiliates])

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Utilisateur',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' size={32}>
            {getInitials(row.original?.user?.name || 'User')}
          </CustomAvatar>
          <div className='flex flex-col items-start'>
            <Typography variant='body2' color='text.primary'>#{row.original?._id?.slice(0,6).toUpperCase()}</Typography>
            <Typography variant='body2' color='text.primary'>{row.original?.user?.name || 'Admin'}</Typography>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ row }) => <Typography variant='body2'>{row.original?.user?.email}</Typography>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Inscrit le',
      cell: ({ row }) => <Typography variant='body2'>{new Date(row.original?.createdAt).toLocaleDateString()}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: ({ row }) => (
        <Chip
          label={row.original?.user?.isActive ? 'Actif' : 'Inactif'}
          color={row.original?.user?.isActive ? 'success' : 'error'}
          variant='tonal'
        />
      )
    }),
    columnHelper.accessor('affiliateLink', {
      header: 'Lien affilié',
      cell: ({ row }) => (
        <a href={row.original?.referralLink} target='_blank' rel='noreferrer'>
          {row.original?.referralLink}
        </a>
      )
    }),
    columnHelper.accessor('count', {
      header: 'Nombre fileul',
      cell: ({ row }) => <Chip 
        size='small' 
        label={row.original?.referrals?.length} 
        color='success'
      />
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <IconButton onClick={() => handleView(row.original)}>
            <i className='tabler-eye text-primary' />
          </IconButton>
          <IconButton onClick={() => handleEdit(row.original?._id)}>
            <i className='tabler-edit text-warning' />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original?.user)}>
            <i className='tabler-trash text-error' />
          </IconButton>
        </div>
      ),
      enableSorting: false
    })
  ], [data])

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 8 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleDelete = (data) => {
    setMsg('Voulez-vous vraiment supprimer cet affilié ?')
    setAction(1)
    setShowDialog(true)
    setAffiliateData(data)
  }

  const handleUpdate = (data) => {
    setMsg(`Voulez-vous vraiment ${data?.isActive ? 'désactiver' : 'activer'} cet affilié ?`)
    setAction(2)
    setShowDialog(true)
    setAffiliateData(data)
  }

  const handleAction = async () => {
    showLoader()
    setShowDialog(false)
    try {
      let res
      if (action === 1) {
        res = await deleteAffiliate(affiliateData?._id)
      } else if (action === 2) {
        res = await updateStatusAffiliate(affiliateData?._id, { isActive: !affiliateData?.isActive })
      }
      hideLoader()

      if (res === 200) {
        fetchAffiliates()
        setAffiliateData(null)
        showToast(`Affilié ${action === 1 ? 'supprimé' : affiliateData?.isActive ? 'désactivé' : 'activé'} avec succès.`, 'success', 5000)
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer', 'error', 5000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Typography variant='h5' className='mb-5'>Liste des affiliés</Typography>

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
            onClick={() => setAddAffiliateOpen(!addAffiliateOpen)}
            startIcon={<i className='tabler-plus' />}
          >
            Ajouter affilié
          </Button>
          {/* <div className='flex items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Rechercher'
              className='w-[350px]'
            />
          </div> */}
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead style={{ backgroundColor: '#F5F5F5' }}>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>No data available</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.slice(0, table.getState().pagination.pageSize).map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
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

      <AddAffiliateDrawer
        open={addAffiliateOpen}
        affiliateData={affiliate}
        setData={setData}
        handleClose={() => setAddAffiliateOpen(!addAffiliateOpen)}
        fetchAffiliates={fetchAffiliates}
        setAffiliateData={setAffiliate}
      />

      {/* Dialog pour voir les infos détaillées de l'affilié */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Informations Affilié</DialogTitle>
        <DialogContent dividers>
          {selectedAffiliate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Nom :</strong> {selectedAffiliate.user?.name}</Typography>
              <Typography><strong>Email :</strong> {selectedAffiliate.user?.email}</Typography>
              <Typography><strong>Téléphone :</strong> {selectedAffiliate.user?.phoneNumber || '-'}</Typography>
              <Typography><strong>Lien affilié :</strong> {selectedAffiliate.referralLink}</Typography>
              <Typography><strong>Gains :</strong> {selectedAffiliate.earnings || 0} F CFA</Typography>
              <Typography><strong>Retraits :</strong> {selectedAffiliate.totalPayout || 0} F CFA</Typography>
              <Typography><strong>Nombre de filleuls :</strong> {selectedAffiliate.referrals?.length || 0}</Typography>
              <Typography><strong>Inscrit le :</strong> {new Date(selectedAffiliate.createdAt).toLocaleDateString()}</Typography>
              <Typography><strong>Statut :</strong> {selectedAffiliate.user?.isActive ? 'Actif' : 'Inactif'}</Typography>
            </Box>
          )}
        </DialogContent>
        <div className='flex justify-end p-4'>
          <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
        </div>
      </Dialog>
    </>
  )
}

export default AffiliateTable

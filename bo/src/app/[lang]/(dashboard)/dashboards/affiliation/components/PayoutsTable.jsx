'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { Dialog, DialogTitle, DialogContent, Box, Chip, InputAdornment, IconButton } from '@mui/material'
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
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'

import tableStyles from '@core/styles/table.module.css'
import { useAdminAffiliationStore } from '@/contexts/AffiliationContext'

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

const PayoutHistoryTable = ({ payouts, fetchPayouts }) => {
  const [data, setData] = useState([])
  const { updatePayout } = useAdminAffiliationStore()
  const [globalFilter, setGlobalFilter] = useState('')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)

  useEffect(() => {
    setData(payouts || [])
  }, [payouts])

  const handleView = (payout) => {
    setSelectedPayout(payout)
    setViewDialogOpen(true)
  }

  const status = {
    requested: 'En attente',
    paid: 'Payé',
    rejected: 'Refusé',
    approved: 'Approuvé'
  }

  const columns = useMemo(() => [
    columnHelper.accessor('affiliate.user.name', {
      header: 'Affilié',
      cell: ({ row }) => <Typography>{row.original.affiliate?.user?.name || '-'}</Typography>
    }),
    columnHelper.accessor('amount', {
      header: 'Montant payé',
      cell: ({ row }) => <Typography>{row.original.amount} F CFA</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: ({ row }) => (
        <Chip
          label={status[row.original.status] || 'En attente'}
          color={["paid", "approved"].includes(row.original.status) ? 'success' : row.original.status === 'rejected' ? 'error' : 'warning'}
          variant='tonal'
        />
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: ({ row }) => <Typography>{new Date(row.original.requestedAt).toLocaleDateString()}</Typography>
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
         <div className='flex items-center gap-2'>
            <IconButton onClick={() => handleView(row.original)}>
              <i className='tabler-eye text-primary' />
            </IconButton>
            <IconButton title='Mettre à jour le status' onClick={() => handleStatusClick(row.original)}>
              <i className='tabler-edit text-warning' />
            </IconButton>
          </div>
      ),
      enableSorting: false
    })
  ], [])

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

  // Ajout des nouveaux états
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedAffiliateForStatus, setSelectedAffiliateForStatus] = useState(null)
  const [statusAction, setStatusAction] = useState(null) // 'approved' ou 'rejected'

  // Nouvelle fonction pour ouvrir le dialog de statut
  const handleStatusClick = (affiliate) => {
    setSelectedAffiliateForStatus(affiliate)
    setStatusDialogOpen(true)
    setStatusAction(null)
  }

  // Fonction pour confirmer l'action
  const handleConfirmStatus = async () => {
    if (!selectedAffiliateForStatus || !statusAction) return
    showLoader()
    setStatusDialogOpen(false)
    try {
      // Appelle ton store / API pour mettre à jour le statut
      const res = await updatePayout(selectedAffiliateForStatus._id, { status: statusAction })
      console.log(res)
      hideLoader()

      if (res.status === 200) {
        showToast(`Payout ${statusAction === 'paid' ? 'payé' : statusAction === 'approved' ? 'approuvé' : 'rejeté'} avec succès`, 'success', 5000)
        setStatusDialogOpen(false)
        setSelectedAffiliateForStatus(null)
        setStatusAction(null)
        fetchPayouts() 
      }
     // rafraîchir la liste
    } catch (err) {
      console.log(err)
      showToast('Erreur lors de la mise à jour du statut', 'error', 5000)
    } finally {
      hideLoader()
    }
  }


  return (
    <>
      <Typography variant='h5' className='mb-5'>Historique des paiements</Typography>

      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
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
                  <tr key={row.id}>
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

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
  <DialogTitle>Mettre à jour le statut</DialogTitle>
  <DialogContent dividers>
    {selectedAffiliateForStatus && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography><strong>Affilié :</strong> {selectedAffiliateForStatus?.affiliate?.user?.name}</Typography>
        <Typography><strong>Email :</strong> {selectedAffiliateForStatus?.affiliate?.user?.email}</Typography>
        <Typography><strong>Gains :</strong> {selectedAffiliateForStatus.amount || 0} F CFA</Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant={statusAction === 'approved' ? 'contained' : 'outlined'}
            color='success'
            onClick={() => setStatusAction('approved')}
          >
            Approuver
          </Button>
          <Button
            variant={statusAction === 'paid' ? 'contained' : 'outlined'}
            color='success'
            onClick={() => setStatusAction('paid')}
          >
            Payé
          </Button>
          <Button
            variant={statusAction === 'rejected' ? 'contained' : 'outlined'}
            color='error'
            onClick={() => setStatusAction('rejected')}
          >
            Rejeter
          </Button>
        </Box>
      </Box>
    )}
  </DialogContent>
  <Box className='flex justify-end p-4' gap={2}>
    <Button onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
    <Button
      variant='contained'
      disabled={!statusAction}
      onClick={handleConfirmStatus}
    >
      Confirmer
    </Button>
  </Box>
</Dialog>

      {/* Dialog pour voir les détails d’un payout */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Détails du paiement</DialogTitle>
        <DialogContent dividers>
          {selectedPayout && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Affilié :</strong> {selectedPayout.affiliate?.user?.name || '-'}</Typography>
              <Typography><strong>Email :</strong> {selectedPayout.affiliate?.user?.email || '-'}</Typography>
              <Typography><strong>Montant :</strong> {selectedPayout.amount} F CFA</Typography>
              <Typography><strong>Statut :</strong> {selectedPayout.status || 'En attente'}</Typography>
              <Typography><strong>Date :</strong> {new Date(selectedPayout.createdAt).toLocaleDateString()}</Typography>
              <Typography><strong>Lien affilié :</strong> {selectedPayout.affiliate?.referralLink || '-'}</Typography>
              <Typography><strong>Gains totaux :</strong> {selectedPayout.affiliate?.earnings || 0} F CFA</Typography>
              <Typography><strong>Retraits totaux :</strong> {selectedPayout.affiliate?.totalPayout || 0} F CFA</Typography>
              <Typography><strong>Nombre de filleuls :</strong> {selectedPayout.affiliate?.referrals?.length || 0}</Typography>
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

export default PayoutHistoryTable

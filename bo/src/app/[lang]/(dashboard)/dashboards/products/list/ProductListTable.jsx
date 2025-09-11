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

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatAmount } from '@/utils/formatAmount'
import { API_URL_ROOT, URL_SITE } from '@/settings'
import { usePropertyStore } from '@/contexts/PropertyStore'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { Badge, IconButton, InputAdornment } from '@mui/material'
import dayjs from 'dayjs'
import { colors } from '@/data/constant'
import { COLORS } from '@/configs/theme'
import SearchIcon from '@mui/icons-material/Search';

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  const name = row.original?.name?.toLowerCase() || '';
  const id = "#"+row.original?._id?.toString().slice(0, 6).toUpperCase() || '';

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

const statusProduct = {
  active: { title: 'Actif', color: 'success' },
  inactive: { title: 'Inactif', color: 'error' },
  draft: { title: 'Brouillon', color: 'warning' }
}

// Column Definitions
const columnHelper = createColumnHelper()

const ProductListTable = ({ productData }) => {
  // States
  const { deleteProduct, updateStatusProduct } = usePropertyStore();
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showDialog, setShowDialog] = useState(false);

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setData(productData);
  }, [productData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Produit',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <img src={row.original.photos[0]} width={60} className='rounded bg-actionHover' />
            <div className='flex flex-col'>
              <Typography variant='body2'>PROD-{row.original?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
              <Typography variant='body2' className='font-medium' color='text.primary' style={{ whiteSpace: 'wrap' }}>
                {row.original?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => (
          <div className='flex items-center gap-4' style={{ width: '100px' }}>
            <Typography variant='body2' whiteSpace={'wrap'}>{row.original?.category}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Prix',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col gap-1'>
              <Typography variant='body2'>
                {!row.original.isSubscriptionBased ? formatAmount(row.original?.price || 0) + 'FCFA'
                : row.original?.subscriptionId?.title} 
              </Typography>
            </div>
          );
        }
      }),
      columnHelper.accessor('pricePromo', {
        header: 'Prix Promotion',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col gap-1'>
              <Typography variant='body2'>
                {!row.original.isSubscriptionBased ? formatAmount(row.original?.pricePromo || row.original?.price || 0) + ' FCFA' 
                : row.original?.subscriptionId?.title}
              </Typography>
            </div>
          );
        }
      }),
      
      columnHelper.accessor('statuss', {
        header: 'Status',
        cell: ({ row }) => (
        <Chip
            label={statusProduct[row.original?.productStatus]?.title}
            variant='tonal'
            color={statusProduct[row.original?.productStatus]?.color}
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
     columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleActiveOrInactive(row.original._id) }
              title={row.original?.productStatus === 'active' ? 'Désactiver le produit' : 'Activer le produit'}>
              <i className={`tabler-${row.original?.productStatus === 'active' ? 'eye-off' : 'eye'}`} style={{color: row.original?.productStatus === 'active' ? '#f44336' : '#4caf50'}} />
            </IconButton>
            <IconButton onClick={() => window.open(`${URL_SITE}fr/produit/${row.original._id}`) }
              title='Voir le produit'>
              <i className={`tabler-eye`} style={{color: '#4caf50'}} />
            </IconButton>
            <IconButton onClick={() => window.location.href = `/${locale}/dashboards/products/details/${row.original._id}`}
              title='Voir les détails du produit'>
              <i className='tabler-info-circle' style={{color: COLORS.primary}} />
            </IconButton>
            <IconButton onClick={() => window.location.href = `/${locale}/dashboards/product-add?id=${row.original._id}`}
              title='Modifier le produit'>
              <i className='tabler-edit' style={{color: COLORS.warning}} />
            </IconButton>
            <IconButton onClick={() => {
                sessionStorage.setItem("_productId", row.original?._id);
                setShowDialog(true)
              }}
              title='Supprimer le produit'>
              <i className='tabler-trash' style={{color: COLORS.error}} />
            </IconButton>
          </div>
        ),
        enableSorting: false
      }) 
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  );
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

  const handleDelecteProperty = async () => {
    let id = sessionStorage.getItem("_productId") || '';
    if (id) {
      setShowDialog(false);
        showLoader();

        try {
            const res = await deleteProduct(id);
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

  const handleActiveOrInactive = async (id) => {
    if (id) {
      setShowDialog(false);
        showLoader();

        try {
            const res = await updateStatusProduct(id);
            hideLoader();
            if (res) {
                if (res === 200) {
                  showToast("Le statut a été modifié !", "success", 5000);
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

  return (
    <>
       {showDialog && (
        <ConfirmationDialog
          title="Supprimer l'élément"
          message="Êtes-vous sûr de vouloir supprimer cet élément ?"
          onConfirm={handleDelecteProperty}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <Card className='p-0'>
        <TableFilters setData={setFilteredData} productData={data} />
        <Divider />
        <div className='flex flex-wrap justify-between xs:justify-start gap-4 p-6'>       
          <Button
            variant='contained'
            component={Link}
            className='xs:is-full is-auto'
            href={getLocalizedUrl('/dashboards/product-add', locale)}
            startIcon={<i className='tabler-plus' />}
          >
            Nouveau produit
          </Button>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Rechercher par Id et nom...'
            className='w-[350px] max-sm:is-full'
          />
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead style={{ backgroundColor: '#f5f5f5' }}>
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
                    Aucune donnée disponible
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
    </>
  )
}

export default ProductListTable

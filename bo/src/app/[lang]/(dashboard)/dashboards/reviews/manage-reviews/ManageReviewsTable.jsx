'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import TablePagination from '@mui/material/TablePagination'
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

// Component Import
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useReviewStore } from '@/contexts/ReviewStore'
import CustomAvatar from '@/@core/components/mui/Avatar'

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

// Column Definitions
const columnHelper = createColumnHelper()

const ManageReviewsTable = ({ reviewsData }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const { deleteReview } = useReviewStore();
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setData(reviewsData)
  },[reviewsData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('customers', {
        header: 'Client',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original?.user?.picture, name: row.original?.user?.name })}
            <div className='flex flex-col'>
              <Typography variant='body2'>#{row.original?.user?._id?.toString().slice(0, 6).toUpperCase()}</Typography>
              <Typography className='font-medium' color='text.primary' whiteSpace={'wrap'}>
                {row.original?.user?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('product', {
        header: 'Produit',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <img src={row.original.product?.photos[0]} width={80} height={80} className='rounded bg-actionHover' />
          </div>
        )
      }),
      columnHelper.accessor('message', {
        header: 'Commentaire',
        cell: ({ row }) => (
          <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          <Typography variant="body2" overflow='hidden' textOverflow='ellipsis' whiteSpace='wrap'>
            {row.original?.comment}{row.original?.comment}{row.original?.comment}{row.original?.comment}
          </Typography>
        </Box>
        )
      }),
      columnHelper.accessor('head', {
        header: 'Note',
        sortingFn: (rowA, rowB) => rowA.original.review - rowB.original.review,
        cell: ({ row }) => (
          <div className='flex flex-col gap-1'>
            <Rating
              name='product-review'
              readOnly
              size='small'
              value={row.original.rating}
              emptyIcon={<i className='tabler-star-filled' />}
            />
            <Typography className='font-medium' color='text.primary'>
              {row.original.head}
            </Typography>
            <Typography variant='body2' className='text-wrap'>
              {row.original.para}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt).toLocaleDateString('fr-FR', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center' style={{  }}>
            <Button href={`/${locale}/dashboards/reviews/details/${row.original?._id}`}>
              <i className='tabler-eye'></i>
            </Button>
            <Button onClick={() => {
              setReview(row.original);
              setOpen(true);
            }} color='error' size='small'>
              <i className='tabler-trash'></i>
            </Button>
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

  const handleDeleteReview = async () => {
    const response = await deleteReview(review._id);
    console.log(response);
    if (response.status === 200) {
      setData(data.filter(rev => rev._id !== review._id));
      setOpen(false);
    }
  }

  const getAvatar = params => {
    const { avatar, name } = params
    
    return <CustomAvatar src={avatar} skin='light' size={34} />
  }


  return (
    <>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          {/* <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Product'
            className='max-sm:is-full'
          /> */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              Confirmation
            </DialogTitle>
            <DialogContent>
              <Typography>
                Voulez-vous vraiment supprimer ce commentaire ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color='secondary'>Annuler</Button>
              <Button onClick={handleDeleteReview} color='error'>Supprimer</Button>
            </DialogActions>
          </Dialog>
          <div className='flex max-sm:flex-col sm:items-center gap-4 max-sm:is-full'>
          {/*   <CustomTextField
              select
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
              className='is-full sm:is-[140px] flex-auto'
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Published'>Published</MenuItem>
              <MenuItem value='Pending'>Pending</MenuItem>
            </CustomTextField> */}
           {/*  <Button
              variant='tonal'
              className='max-sm:is-full'
              startIcon={<i className='tabler-upload' />}
              color='secondary'
            >
              Export
            </Button> */}
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
    </>
  )
}

export default ManageReviewsTable

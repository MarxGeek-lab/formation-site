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
import { Chip, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material'
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { useAdminStore } from '@/contexts/AdminContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import AddNewsletter from './AddNewsletter'
import { useNewsletterStore } from '@/contexts/NewsletterContext'
import SearchIcon from '@mui/icons-material/Search'
import UserSelectionDialog from './UserSelectionDialog'

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

const ListTable = ({ customers, fetchNewsletterMessage, NewsletterMessages }) => {
  // States
  const { sendMessage, deleteMessage } = useNewsletterStore();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [msg, setMsg] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [action, setAction] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const [selectUserDialog, setSelectUserDialog] = useState(false);
  const [users, setUsers] = useState([]);

  const handleEdit = (id) => {
    const t = data.find(item => item._id === id);
    setMessage(t);
    setAddCategoryOpen(true);
  }

  useEffect(() => {
    setData(NewsletterMessages)
  },[NewsletterMessages]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Titre',
        cell: ({ row }) => (
          <div className='is-[250px] text-wrap word-break'>
              <Typography variant='body1' sx={{wordBreak: 'break-all'}}>{row.original?.subject}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('date', {
        header: 'Message',
        cell: ({ row }) => (
          <Typography sx={{width: '600px'}} variant='body1'>
            <div className='is-[600px] text-wrap' dangerouslySetInnerHTML={{__html: row.original?.htmlContent}} />
          </Typography>
        )
      }),
      columnHelper.accessor('subject', {
        header: 'Image',
        cell: ({ row }) => (
          <div className='is-[60px] text-wrap'>
            <img src={row.original?.image} width={60} height={60} className='rounded bg-actionHover' />
          </div>
        )
      }),
      columnHelper.accessor('create', {
        header: 'Date de création',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {new Date(row.original?.createdAt).toLocaleString()}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip 
            label={row.original?.status === 'published' ? 'Publié':'Non publié'}
            color={row.original?.status === 'published' ? 'success':'error'}
            variant='tonal'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* {row.original?.status !== 'published' && ( */}
              <>
                <IconButton onClick={() => {
                  setSelectUserDialog(true)
                  setMessageData(row.original)
                }}>
                  <i className={`tabler-${row.original?.isActive ? 'eye-off':'send'} text-primary`} />
                </IconButton>
                <IconButton onClick={() => handleEdit(row.original?._id)}>
                  <i className='tabler-edit text-warning' />
                </IconButton>
              
              </>
            {/* )} */}
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
    setMsg('Voulez-vous vraiment supprimer le newsletter ?');
    setAction(1);
    setShowDialog(true);
    setMessageData(data);
  }

  const handleSend = (data) => {
    console.log(data)
    setMsg("Voulez-vous vraiment envoyer la newsletter ? Cette action est irréversible.");
    setAction(2);
    setShowDialog(true);
    setMessageData(data);
  }

  const handleAction = async ({ sendToAll, userIds, byEmail, bySMS }) => {
    console.log({ sendToAll, userIds, byEmail, bySMS })
    console.log(messageData)  

    if (messageData && messageData?._id) {
      showLoader();
      setSelectUserDialog(false);
    
      try {
        const res = await sendMessage({
          id: messageData?._id,
          sendToAll,
          userIds,
          byEmail: true,
          bySMS: false,
        });
    
        hideLoader();
        if (res === 200) {
          fetchNewsletterMessage();
          setMessageData(null);
          showToast("Newsletter envoyé avec succès.", "success", 5000);
        } else {
          showToast("Une erreur est survenue. Veuillez réessayer", "error", 5000);
        }
      } catch (err) {
        hideLoader();
        console.error(err);
        showToast("Erreur lors de l'envoi", "error", 5000);
      }
    }
  };

  return (
    <>
       {showDialog && (
        <ConfirmationDialog
          title="Confirmation"
          message={msg}
          checkbox={true}
          onConfirm={(options) => handleAction(options)}
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
      <AddNewsletter
        open={addCategoryOpen}
        messageData={message}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
        fetchNewsletterMessage={fetchNewsletterMessage}
        setMessageData={setMessage}
      />
      <UserSelectionDialog
        open={selectUserDialog}
        onClose={() => setSelectUserDialog(false)}
        onConfirm={(options) => {
          console.log(options)
          handleAction(options)
        }}
        users={customers}
      />
    </>
  )
}

export default ListTable

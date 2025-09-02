'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { useColorScheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { useAuthStore, usePropertyStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'
import { API_URL_ROOT } from '@/settings'
import dayjs from '@/configs/dayjs.config';
import { useParams } from 'next/navigation'
import { formatAmount } from '@/utils/formatAmount'
import { statusPayObj } from '@/data/constant'


const LastTransaction = ({ serverMode }) => {
  // Hooks
  const { mode } = useColorScheme()
  const { lang: locale } = useParams();

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode

  const { getPaymentsBySeller } = usePropertyStore();
  const { user } = useAuthStore();
  const [ payments, setPayments ] = useState([]);

  const fetchPayments = async () => {
    if (user) {
      try {
        const { data } = await getPaymentsBySeller(user?._id);
        setPayments(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [user]); 

  return (
    <Card>
      <CardHeader
        title='Dernières transactions'
        action={<OptionMenu options={['Show all entries', 'Refresh', 'Download']} />}
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2'>Méthode</th>
              <th className='leading-6 plb-4 pli-2'>Opération</th>
              <th className='leading-6 plb-4 pli-2'>Type</th> 
              <th className='leading-6 plb-4 pli-2'>Montant ( F CFA )</th>
              <th className='leading-6 plb-4 pli-2'>Date</th>
              <th className='leading-6 plb-4 pli-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.slice(0, 5).map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>
                    <Avatar
                      variant='rounded'
                      className={classnames('is-[50px] bs-[30px]', {
                        'bg-white': _mode === 'dark',
                        'bg-actionHover': _mode === 'light'
                      })}
                    >
                      <img width={30} alt={row.imgName} src={`${API_URL_ROOT}${row?.paymentMethod?.toLowerCase()}.png`} />
                    </Avatar>
                    <div className='flex flex-col'>
                      <Typography color='text.primary' style={{ width: '120px', whiteSpace: 'wrap' }}>PAY-{row?._id?.slice(0, 6).toUpperCase()}</Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {row?.paymentMethod}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className='pli-2 plb-3 pie-6 text-left'>
                  <Chip
                    label={row?.isRefundTransaction ? 'Remboursement' : 'Paiement'}
                    variant='tonal'
                    color={row?.isRefundTransaction ? 'info' : 'success'}
                    size='small'
                  />
                </td>
                <td className='pli-2 plb-3 pie-6 text-left'>
                  <Chip
                    label={row?.type === 'refundCancelation' ? 'Annulation' : 'Réservation'}
                    variant='tonal'
                    color={row?.type === 'refundCancelation' ? 'warning' : 'primary'}
                    size='small'
                  />
                </td>
                <td className='pli-2 plb-3 pie-6 text-left'>
                  <Typography color='text.primary'>{formatAmount(row.amount || 0)}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>
                    <Typography variant='body2' color='text.primary'>
                      {dayjs(row.createdAt).locale(locale).format('DD/MM/YYYY HH:mm:ss')}
                    </Typography>
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <Chip
                    variant='tonal'
                    size='small'
                    label={statusPayObj[row.status]?.text}
                    color={statusPayObj[row.status]?.color}
                  />
                </td>
                <td className='pli-2 plb-3 pie-6 text-right'>
                  <Typography color='text.primary'>{row.trend}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default LastTransaction

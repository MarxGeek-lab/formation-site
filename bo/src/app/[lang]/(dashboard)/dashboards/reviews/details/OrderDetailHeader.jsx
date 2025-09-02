// MUI Imports
import { statusLocObj } from '@/data/constant'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Component Imports
import dayjs from 'dayjs'

export const paymentStatus = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}
export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

const OrderDetailHeader = ({ orderData, order }) => {
  // Vars
  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  const status = {
    pending: 'En cours',
    terminated: 'Terminé',
    cancelled: 'Annulé',
    completed: 'Terminé'
  }

  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <div className='flex items-center flex-wrap gap-2'>
          <Typography variant='h5'>{`Avis #${order?.toString().slice(0, 6).toUpperCase()}`}</Typography>
        </div>
        <Typography>Créer le {`${dayjs(orderData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}`}</Typography>
      </div>
    </div>
  )
}

export default OrderDetailHeader

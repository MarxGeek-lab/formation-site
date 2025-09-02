// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import dayjs from 'dayjs'
import Link from '@/components/Link'
import { getLocalizedUrl } from '@/utils/i18n'
import { useParams } from 'next/navigation'

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

const DetailHeader = ({ paymentData, order }) => {
  const {  lang: locale } = useParams();

  const status = {
    pending: { title: 'En cours', color: 'warning' },
    failed: { title: 'Annulé', color: 'error'},
    completed: { title: 'Terminé', color: 'success' },
    refunded: { title: 'Remboursement', color: 'info' }
  }

  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>
            <Typography variant='h5'>{`Paiement #PAY-${order?.toString().slice(0, 6).toUpperCase()}`}</Typography>
          </div>
        </div>
        <Typography>Créer le {`${dayjs(paymentData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}`}</Typography>
      </div>
      <div className='flex gap-4'>
         {/*  <Button
            variant='tonal'
            component={Link}
            // startIcon={<i className='tabler-paper-plane' />}
            href={getLocalizedUrl('/dashboards/payments/invoice/add', locale)}
            className='max-sm:is-full'
          >
            Télécharger la facture
          </Button>
          <Button
            variant='contained'
            component={Link}
            // startIcon={<i className='tabler-plus' />}
            href={getLocalizedUrl('/dashboards/payments/invoice/add', locale)}
            className='max-sm:is-full'
          >
            Envoyer la facture
          </Button> */}
        </div>
    </div>
  )
}

export default DetailHeader

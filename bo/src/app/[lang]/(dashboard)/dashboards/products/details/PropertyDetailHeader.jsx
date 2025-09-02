// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import dayjs from 'dayjs'
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

const PropertyDetailHeader = ({ propertyData, propertyId }) => {
  // Vars
  const { lang: locale } = useParams();

  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <div className='flex items-center flex-wrap gap-2'>
          <Typography variant='h5'>{`Produit PROD-${propertyId?.toString().slice(0, 6).toUpperCase()}`}</Typography>
        </div>
        <Typography>Créer le {`${dayjs(propertyData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}`}</Typography>
      </div>
      <div className="flex gap-2">
        <Button color='warning' variant='contained' startIcon={<i className="tabler-edit" />}
          href={`/${locale}/dashboards/product-add?id=${propertyId}`}>
          Modifier
        </Button>
        <Button color="error" variant='contained' startIcon={<i className="tabler-trash" />}>
          Supprimer
        </Button>
      </div>
    </div>
  )
}

export default PropertyDetailHeader

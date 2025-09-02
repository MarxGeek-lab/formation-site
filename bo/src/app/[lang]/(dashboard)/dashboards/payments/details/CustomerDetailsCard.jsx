// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const getAvatar = params => {
  const { avatar, customer } = params

  if (avatar) {
    return <Avatar src={avatar} />
  } else {
    return <Avatar>{getInitials(customer)}</Avatar>
  }
}

// Vars
const userData = {
  firstName: 'Gabrielle',
  lastName: 'Feyer',
  userName: '@gabriellefeyer',
  billingEmail: 'gfeyer0@nyu.edu',
  status: 'active',
  role: 'Customer',
  taxId: 'Tax-8894',
  contact: '+1 (234) 464-0600',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true
}

const CustomerDetails = ({ paymentData }) => {
  // Vars
  const typographyProps = (children, color, className) => ({
    children,
    color,
    className
  })

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Détail client</Typography>
        <div className='flex items-center gap-3'>
          {getAvatar({ avatar: paymentData?.picture ?? '', customer: paymentData?.picture ?? '' })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {paymentData?.name}
            </Typography>
            {/* <Typography>ID: # {orderData?._id} </Typography> */}
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography color='text.primary' className='font-medium'>
              Contact info
            </Typography>
          </div>
          <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Email:  <span>{paymentData?.email}</span></Typography>
          {paymentData?.phoneNumber && <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Téléphone: <span>{paymentData?.phoneNumber}</span></Typography>}
          <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Adresse: <span>{[paymentData?.country || '', paymentData?.city || '', paymentData?.district || ''].join(', ')}</span></Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails

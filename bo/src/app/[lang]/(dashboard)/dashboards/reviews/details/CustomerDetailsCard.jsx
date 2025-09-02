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

const CustomerDetails = ({ rentalData }) => {
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
          {getAvatar({ avatar: rentalData?.picture ?? '', customer: rentalData?.picture ?? '' })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {rentalData?.name}
            </Typography>
            {/* <Typography>ID: # {orderData?._id} </Typography> */}
          </div>
        </div>
     {/*    <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' color='success' size={40}>
            <i className='tabler-shopping-cart' />
          </CustomAvatar>
          <Typography color='text.primary' className='font-medium'>
            12 Orders
          </Typography>
        </div> */}
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography color='text.primary' className='font-medium'>
              Contact info
            </Typography>
          {/*   <OpenDialogOnElementClick
              element={Typography}
              elementProps={typographyProps('Edit', 'primary', 'cursor-pointer font-medium')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            /> */}
          </div>
          <Typography fontSize={14} className='flex gap-2'>Email:  <span>{rentalData?.email}</span></Typography>
          <Typography fontSize={14} className='flex gap-2'>Téléphone: <span>{rentalData?.phoneNumber}</span></Typography>
          <Typography fontSize={14} className='flex gap-2'>Adresse: <span>{rentalData?.country+", "+rentalData?.city+", "+rentalData?.district}</span></Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails

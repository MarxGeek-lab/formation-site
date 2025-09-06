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

const CustomerDetails = ({ orderData }) => {

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Details Client</Typography>
        <div className='flex items-center gap-3'>
          {getAvatar({ avatar: orderData?.avatar ?? '', customer: orderData?.name ?? '' })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {orderData?.name}
            </Typography>
            <Typography>Client ID: {orderData?._id?.slice(0, 6).toUpperCase()} </Typography>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography color='text.primary' className='font-medium'>
              Contact
            </Typography>
          </div>
          <Typography>E-mail: {orderData?.email}</Typography>
          {orderData?.phoneNumber && (
            <Typography>Téléphone: {orderData?.phoneNumber} </Typography>
          )}
          {(orderData?.address || orderData?.city || orderData?.country) && (
            <Typography>Adresse: {[orderData?.address || '', orderData?.city || '', orderData?.country || ''].join(', ')} </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails

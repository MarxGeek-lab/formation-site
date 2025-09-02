// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

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

const CustomerDetails = ({ withdrawalData }) => {

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Détail client</Typography>
        <div className='flex items-center gap-3'>
          {getAvatar({ avatar: withdrawalData?.picture ?? '', customer: withdrawalData?.picture ?? '' })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {withdrawalData?.name}
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
          <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Email:  <span>{withdrawalData?.email}</span></Typography>
          <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Téléphone: <span>{withdrawalData?.phoneNumber}</span></Typography>
          <Typography fontSize={14} className='flex sm:flex-row flex-col items-start gap-1 sm:gap-4' color='text.primary'>Adresse: <span>{withdrawalData?.country+", "+withdrawalData?.city+", "+withdrawalData?.district}</span></Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails

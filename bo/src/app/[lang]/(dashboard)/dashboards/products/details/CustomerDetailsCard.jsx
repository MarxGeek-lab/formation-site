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
import { Chip } from '@mui/material'

const getAvatar = params => {
  const { avatar, customer } = params

  if (avatar) {
    return <Avatar src={avatar} />
  } else {
    return <Avatar>{getInitials(customer)}</Avatar>
  }
}

const CustomerDetails = ({ property }) => {
  const sta = {
    sold: "Vendu",
    rent: "Loué",
    reserved: "Réservé",
    available: "Disponible",
  }

  const statusValidate = {
    pending: { title: 'En attente', color: 'warning' },
    approved: { title: 'Approuvé', color: 'success' },
    rejected: { title: 'Rejetée', color: 'error' }
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Status</Typography>
 
     {/*    <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' color='success' size={40}>
            <i className='tabler-shopping-cart' />
          </CustomAvatar>
          <Typography color='text.primary' className='font-medium'>
            12 Orders
          </Typography>
        </div> */}
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Status disponible :
            </Typography>
            <Chip
              label={property?.state && sta[property?.state]}
              variant='tonal'
              color={'primary'}
              size='medium'
            /> 
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Status de validation :
            </Typography>
            <Chip
              label={statusValidate[property.statusValidate]?.title}
              variant='tonal'
              color={statusValidate[property.statusValidate]?.color}
              size='medium'
            /> 
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { API_URL_ROOT } from '@/settings'

import avatar from "@/assets/images/avatar.png"
import Image from 'next/image'
import { Avatar } from '@mui/material'

const UserProfileHeader = ({ data }) => {
  return (
    <Card>
      <CardMedia image={"/images/pages/profile-banner.png"} className='bs-[200px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
            {data?.picture ? (
              <img
                height={80} 
                width={80} 
                src={API_URL_ROOT + data?.picture} 
                // onError={handleImageError}
                className='rounded' 
                alt='Profile Background'
              />
            ):(
              <Avatar
                alt={"profile"}
                src={''}
                className='cursor-pointer bs-[80px] is-[80px]'
              />
            )}
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4' className='mt-3'>{data?.name}</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                {data?.designationIcon && <i className={data?.designationIcon} />}
                <Typography className='font-medium'>Propriétaire</Typography>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded'>
            <Chip
              icon={<i className='tabler-circle-filled !text-[4px]'></i>}
              label={data?.isActive ? "Actif" : "Inactif"}
              color={data?.isActive ? "success" : "error"}
              variant="outlined"
              size="small"
              className='py-4'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader

'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useAuthStore } from '@/contexts/GlobalContext'
import { useState } from 'react'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { API_URL_ROOT } from '@/settings'

import favicon from '@/assets/images/favicon.svg'
import Image from 'next/image'
import { showToast } from '@/components/ToastNotification/ToastNotification'

// Styled Component Imports

const ForgotPasswordV1 = () => {
  // Hooks
  const { lang: locale } = useParams()

  const [email, setEmail] = useState('');
  const { forgotPassword } = useAuthStore();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (email) {
        const data = {
          email
        }

        showLoader();

        try {
          const res = await forgotPassword(data);
          hideLoader();
          console.log(res);

          if (res === 200) {
            window.location.href = `/fr/auth/verify-email?email=${email}`;
          } else {
            showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
          }
        } catch (error) {
          console.log(error);
        }
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>Mot de passe oublié</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleForgotPassword} className='flex flex-col gap-6'>
            <CustomTextField 
              autoFocus fullWidth 
              label='Email' 
              placeholder='Entrez votre email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button fullWidth variant='contained' type='submit'>
              Envoyer le lien
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href={getLocalizedUrl('/auth/login', locale)} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Retour à la connexion</span>
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordV1

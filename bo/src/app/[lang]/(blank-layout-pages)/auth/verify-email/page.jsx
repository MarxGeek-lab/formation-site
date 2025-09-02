'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Link from '@components/Link'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Component Imports
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/contexts/GlobalContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { useLocation } from 'react-use'
import { API_URL_ROOT } from '@/settings'

import favicon from '@/assets/images/favicon.svg'
import Image from 'next/image'

const VerifyEmailV1 = () => {
  // Hooks
  const { lang: locale } = useParams()
  const location = useLocation();

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
            showToast('Un email de vérification a été envoyé à votre adresse e-mail.', 'success', 5000);
            setTimeout(() => {
              window.location.href = `/fr/auth/verify-email?email=${email}`;
            }, 2000);
          } else {
            showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
          }
        } catch (error) {
          console.log(error);
        }
    }
  }

   useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const email_ = searchParams.get('email');
  
      if (email_) {
        setEmail(email_);
      } 
    },[]);

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <div className='flex flex-col justify-center items-center gap-1 mbe-6'>
            <Typography variant='h4'>Vérifiez votre e-mail ✉️</Typography>
            <Typography>
              Lien d'activation du compte envoyé à votre e-mail. Veuillez suivre le lien à l'intérieur pour
              continuer.
            </Typography>
          </div>
          {/* <Button fullWidth variant='contained' type='submit' className='mbe-6'>
            Skip For Now
          </Button>  */}
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>Vous n'avez pas reçu le courrier ?</Typography>
            <Button variant='contained' onClick={handleForgotPassword}>
              Renvoyer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmailV1

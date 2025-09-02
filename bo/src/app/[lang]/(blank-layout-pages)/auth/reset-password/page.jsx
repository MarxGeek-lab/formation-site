
'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
// import AuthIllustrationWrapper from '../AuthIllustrationWrapper'
import { useAdminStore, useAuthStore } from '@/contexts/GlobalContext'
import { useLocation } from 'react-use'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { API_URL_ROOT } from '@/settings'

import favicon from '@/assets/images/favicon.svg'
import Image from 'next/image'

// Styled Component Imports

const ResetPasswordV1 = () => {
  const { resetPassword } = useAuthStore();
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [token, setToken] = useState();

  // Hooks
  const { lang: locale } = useParams()
  const location = useLocation();
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password && passwordConfirm) {
      if (password === passwordConfirm) {
        const data = {
          password, token: token
        }

        showLoader();

        try {
          const res = await resetPassword(data);
          hideLoader();
          console.log(res);

          if (res === 200) {
            window.location.href = '/fr/auth/login';
          } else {
            showToast('Une erreur est survenue. Veuillez réessayer ou reprendre le processus', 'error', 5000);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token_ = searchParams.get('token');

    if (token_) {
      setToken(token_);
    } 
  },[]);

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
    {/* <AuthIllustrationWrapper> */}
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>Réinitialiser le mot de passe</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleResetPassword} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Nouveau mot de passe'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <CustomTextField
              fullWidth
              label='Confirmer le mot de passe'
              placeholder='············'
              type={isConfirmPasswordShown ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button fullWidth variant='contained' type='submit'>
              Suivant
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
    {/* </AuthIllustrationWrapper> */}
    </div>
  )
}

export default ResetPasswordV1;

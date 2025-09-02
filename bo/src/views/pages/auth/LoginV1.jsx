'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import { useAuthStore } from '@/contexts/GlobalContext'
import Image from 'next/image'
import Logo from '@/assets/images/favicon.svg'
import { CircularProgress } from '@mui/material'

const LoginV1 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [load, setLoad] = useState(false)
  const [error, setError] = useState('')

  // Hooks
  const { lang: locale } = useParams()
  const { signIn } = useAuthStore()

  // Fonction pour afficher/cacher le mot de passe
  const handleClickShowPassword = () => setIsPasswordShown(prev => !prev)

  // Gestion du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Veuillez entrer vos identifiants de connexion")
      return
    }

    setLoad(true)
    setError('') // Réinitialiser les erreurs

    try {
      const status = await signIn({ email, password })
      setLoad(false);
      console.log(status)

      if (status === 200) {
        window.location.href = '/' // Redirection après connexion réussie
      } else if (status === 429) {
        setError("Trop de tentatives de connexion. Réessayez plus tard.")
      } else {
        setError("Email ou mot de passe incorrect.")
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoad(false)
    }
  }

  return (
    // <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:w-[450px]'>
        <CardContent className='sm:!p-12'>
          {/* <Link href={getLocalizedUrl('/', locale)} className='flex justify-center mb-6'>
            <Image src={Logo} alt='logo' width={55} height={55} />
          </Link> */}
          <div className='flex flex-col justify-center items-center gap-1 mb-6'>
            <Typography variant='h4'>Connectez-vous!</Typography>
          </div>
          <Typography className='mb-8 text-center text-red-500'>{error}</Typography>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Entrer votre email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              // helperText={error}
            />
            <CustomTextField
              fullWidth
              label='Mot de passe'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              // helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className='flex justify-between items-center flex-wrap'>
              {/* <FormControlLabel control={<Checkbox />} label='Se souvenir de moi' /> */}
              <Typography color='primary.main' component={Link} href={getLocalizedUrl('/pages/auth/forgot-password-v1', locale)}>
                Mot de passe oublié ?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={load}>
              {load ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Se connecter'
                )}
            </Button>
          </form>
        </CardContent>
      </Card>
    // </AuthIllustrationWrapper>
  )
}

export default LoginV1

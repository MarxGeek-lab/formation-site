'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Third-party Imports

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useAuthStore } from '@/contexts/GlobalContext';
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { API_URL_ROOT } from '@/settings'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false);
  const [completeProfile, setCompleteProfile] = useState(false);
  const { user, getUserById, signOut } = useAuthStore()
  const [ userProfile, setUserProfile ] = useState();
  const [ showDialog, setShowDialog ] = useState(false);
  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event, url) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    setShowDialog(true);
  }


  const fetchUserProfile = async () => {
    if (user) {
        try {
            const { data, status } = await getUserById(user._id);
            if (status === 200) {
              setUserProfile(data);
              if (data && !data.isVerified) {
                const profil = sessionStorage.getItem('showDialogProfil');

                // if (!profil) {
                //   setCompleteProfile(true);
                // }
              }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const goToProfile = async () => {
  setCompleteProfile(false);
  window.location.href = `/${locale}/dashboards/user-profile`;
  sessionStorage.setItem('showDialogProfil', 'true');
}

useEffect(() => {
    fetchUserProfile();
}, [user]);

  return (
    <>
     {showDialog && (
        <ConfirmationDialog
          title="Déconnexion"
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          onConfirm={signOut}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <Dialog open={completeProfile}>
        <DialogTitle>Profil incomplet</DialogTitle>
        <DialogContent>
          <Typography>
          ℹ️ Pour publier une annonce, vous devez d'abord <strong>compléter votre profil</strong> en soumettant les documents nécessaires à la vérification puis patienter pour que votre demande soit traité.
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="inherit">Fermer</Button> */}
          <Button onClick={goToProfile} variant="contained" color="primary">
            Compléter mon profil
          </Button>
        </DialogActions>
      </Dialog>
      <Badge
        ref={anchorRef}
        overlap='circular'
        // badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {userProfile?.name || "Utilisateur"}
        {userProfile?.picture ? (
          <img
            height={38} 
            width={38} 
            src={API_URL_ROOT + userProfile?.picture} 
            className='rounded cursor-pointer bs-[38px] is-[38px]'
            ref={anchorRef}
            style={{ borderRadius: '50%' }} 
            onClick={handleDropdownOpen}
            alt='Profile Background' 
          />
        ):(
          <Avatar
            ref={anchorRef}
            alt={"Marx"}
            src={''}
            onClick={handleDropdownOpen}
            className='cursor-pointer bs-[38px] is-[38px]'
          />
        )}
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    {userProfile?.picture ? (
                      <img
                        height={38} 
                        width={38} 
                        src={API_URL_ROOT + userProfile?.picture} 
                        className='rounded'
                        style={{ borderRadius: '50%' }} 
                        alt='Profile Background' 
                      />
                    ):(
                      <Avatar
                        ref={anchorRef}
                        alt={"Marx"}
                        src={''}
                        onClick={handleDropdownOpen}
                        className='cursor-pointer bs-[38px] is-[38px]'
                      />
                    )}
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userProfile?.name || 'User'}
                      </Typography>
                      <Typography variant='caption'>{userProfile?.name || 'User'}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/dashboards/user-profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>Mon Profil</Typography>
                  </MenuItem>
                {/*   <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem> */}
               {/*    <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Déconnexion
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown

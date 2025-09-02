// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import { useAdminStore } from '@/contexts/GlobalContext'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { useState } from 'react'

const CustomerDetailHeader = ({ customerId, customer }) => {
  const { desactiveUser, deleteUser } = useAdminStore()
  const [openDelete, setOpenDelete] = useState(false)
  const [openDesactive, setOpenDesactive] = useState(false)

  const handleDelete = async () => {
    try {
      showLoader()
      setOpenDelete(false)
      const status = await deleteUser(customerId)
      hideLoader()
      if (status === 200) {
        setOpenDelete(false)
        showToast("Utilisateur supprimé avec succès", "success", 5000)
      } else {
        showToast("Une erreur est survenue", "error", 5000)
      }
    } catch (error) {
      hideLoader()
      console.log(error)
    }
  }

  const handleDesative = async () => {
    try {
      showLoader()
      setOpenDesactive(false)
      const status = await desactiveUser(customerId)
      hideLoader()
      if (status === 200) {
        setOpenDesactive(false)
        showToast(`Utilisateur ${customer?.isActive ? 'désactivé' : 'reactivé'} avec succès`, "success", 5000)

        setTimeout(() => {
          window.location.reload()
        }, 2000);
      } else {
        showToast("Une erreur est survenue", "error", 5000)
      }
    } catch (error) {
      hideLoader()
      console.log(error)
    }
  }

  return (
    <div className='flex flex-wrap justify-between max-sm:flex-col sm:items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <Typography variant='h4'>{`Client ID USER-${customerId?.toString()?.slice(0, 6).toUpperCase()}`}</Typography>
        {/* <Typography>Aug 17, 2020, 5:48 (ET)</Typography> */}
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='contained' color={customer?.isActive ? 'error' : 'success'} onClick={() => setOpenDesactive(true)}>
          {customer?.isActive ? 'Désactiver' : 'Reactiver'}
        </Button>
        <Button variant='contained' color='error' onClick={() => setOpenDelete(true)}>Supprimer l'utilisateur</Button>
      </div>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Supprimer l'utilisateur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenDelete(false)}>Annuler</Button>
          <Button variant='contained' color='error' onClick={() => handleDelete()}>Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDesactive} onClose={() => setOpenDesactive(false)}> 
        <DialogTitle>{customer?.isActive ? 'Désactiver' : 'Reactiver'} l'utilisateur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment {customer?.isActive ? 'désactiver' : 'reactiver'} cet utilisateur ? {customer?.isActive ? 'Il ne pourra plus se connecter à son compte jusque à ce que vous le réactivez.' : 'Il pourra se connecter à son compte.'}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setOpenDesactive(false)}>Annuler</Button>
          <Button variant='contained' color={customer?.isActive ? 'error' : 'success'} onClick={() => handleDesative()}>{customer?.isActive ? 'Désactiver' : 'Reactiver'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CustomerDetailHeader

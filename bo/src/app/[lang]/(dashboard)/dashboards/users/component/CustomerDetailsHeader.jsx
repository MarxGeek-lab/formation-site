'use client';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import ConfirmationDialog from '@/components/showConfirmationDialog/ShowConfirmationDialog';
import { showToast } from '@/components/ToastNotification/ToastNotification';
// MUI Imports
import { useAdminStore, useAuthStore } from '@/contexts/GlobalContext'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useState } from 'react';

const CustomerDetailHeader = ({ fetchCustomer, userData }) => {
  const { managedUserStatus } = useAdminStore();  
  const { user } = useAuthStore();
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState(0);
  const [msg, setMsg] = useState('Confirmation');
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);

  const confirmAction = (type='approved') => {
    if (user && user?._id) {
      setStatus(type);
      
      if (type === 'approved') {
        setMsg('Êtes-vous sûr de vouloir approuver ce compte ?');
        setShowDialog(true);
      }
      else if (type === 'rejected') {
        setOpen(true);
        setMsg('Êtes-vous sûr de vouloir rejeter ce compte ?');
      } 
      else {
        setOpen(true);
        setMsg('Êtes-vous sûr de vouloir supprimer ce compte ?');
      }
    }
  }

  const handleAction = async () => {
    const formData = {
      admin: user?._id,
      status,
      reason,
      userId: userData?._id
    }
    showLoader();
    setShowDialog(false);
    setOpen(false)

    try {
      const res = await managedUserStatus(formData);
      hideLoader();

      if (res === 200) {
        showToast(`Compte ${status === 'approved' ? 'approuvé':status === 'rejected' ? 'rejeté':'supprimé'} avec succès`, 'success', 5000);
        setStatus('');
        fetchCustomer()
      } else {
        showToast('Echec de l\'opération. Veuillez réessayer', 'error', 5000);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-wrap justify-between max-sm:flex-col sm:items-center gap-x-6 gap-y-4'>
        <Dialog open={open}>
          <DialogTitle>Entrez les raisons</DialogTitle>
          <DialogContent className='is-[500px]'>
            <TextField
              fullWidth
              label="Votre raison"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              margin="dense"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Annuler
            </Button>
            <Button onClick={() => setShowDialog(true)} color="primary" variant="contained">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
       {showDialog && (
        <ConfirmationDialog
          title="Confirmation"
          message={msg}
          onConfirm={handleAction}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <div className='flex flex-col items-start gap-1'>
        <Typography variant='h4'>{`ID #${userData?._id}`}</Typography>
        {/* <Typography>Aug 17, 2020, 5:48 (ET)</Typography> */}
      </div>
      <div className='flex items-center gap-3'>
        {userData?.status === 'submitted' ? (
          <>
            <Button variant='contained' color='primary' onClick={() => confirmAction('approved')}>Approuver</Button>
            <Button variant='contained' color='error' onClick={() => confirmAction('rejected')}>Rejeter</Button>
          </>
        ): userData?.status === 'approved' ? (
          <>
            <Button variant='contained' color='error' onClick={() => confirmAction('rejected')}>Rejeter</Button>
          </>
        ): userData?.status === 'rejected' ? (
          <>
            <Button variant='contained' color='primary' onClick={() => confirmAction('approved')}>Approuver</Button>
            <Button variant='contained' color='error' onClick={() => confirmAction('deleted')}>Supprimer</Button>
          </>
        ):null}
      </div>
    </div>
  )
}

export default CustomerDetailHeader

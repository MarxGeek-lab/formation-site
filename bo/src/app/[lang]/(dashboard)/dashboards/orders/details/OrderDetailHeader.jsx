// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import dayjs from 'dayjs'
import { useCustomerStore, useOrderStore } from '@/contexts/GlobalContext'
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'

export const paymentStatus = {
  1: { text: 'Paid', color: 'success' },
  2: { text: 'Pending', color: 'warning' },
  3: { text: 'Cancelled', color: 'secondary' },
  4: { text: 'Failed', color: 'error' }
}
export const statusChipColor = {
  Delivered: { color: 'success' },
  'Out for Delivery': { color: 'primary' },
  'Ready to Pickup': { color: 'info' },
  Dispatched: { color: 'warning' }
}

const OrderDetailHeader = ({ orderData, order }) => {
  const { reminderOrder, cancelOrder, sendInvoice, downloadInvoice } = useOrderStore()
  const { user } = useCustomerStore()
  const [openReminder, setOpenReminder] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [messageCancel, setMessageCancel] = useState('');

  const handleConfirmReminder = async () => {
    showLoader();
    setOpenReminder(false);
    try {
      const status = await reminderOrder(order);
      hideLoader();

      if (status === 200) {
        showToast('Rappel envoyé !', 'success', 5000);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast('Rappel non envoyé. Veuillez réessayer', 'error', 5000)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmCancel = async () => {
    if (!messageCancel) {
      showToast('Veuillez écrire une raison', 'error', 5000);
      return;
    }

    showLoader();
    setOpenCancel(false);
    try {
      const status = await cancelOrder(order, 
        { reason: messageCancel, rejectedBy: user?._id, cancelledByType: 'owner' });
      hideLoader();

      if (status === 200) {
        showToast('Réservation annulée !', 'success', 5000);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast('Réservation non annulée. Veuillez réessayer', 'error', 5000)
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  }

  const handleConfirmInvoice = async () => {
    showLoader();
    try {
      const status = await sendInvoice(order);
      hideLoader();

      if (status === 200) {
        showToast('Facture envoyée !', 'success', 5000);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast('Facture non envoyée. Veuillez réessayer', 'error', 5000)
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  }

  const handleConfirmDownloadInvoice = async () => {
    showLoader();
    try {
      const {data, status} = await downloadInvoice(order);
      hideLoader();

      if (status === 200) {
        const url = API_URL_ROOT+'invoices/'+data.filename;
          
        // Télécharger le PDF depuis l'URL
        const pdfResponse = await fetch(url);
        const pdfBlob = await pdfResponse.blob();
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `invoice_ORD-${order.slice(0, 6).toUpperCase()}.pdf`;
        link.click();
        
        // Nettoyer l'URL
        URL.revokeObjectURL(link.href);
        showToast('Facture téléchargée !', 'success', 5000);
      } else {
        showToast('Facture non téléchargée. Veuillez réessayer', 'error', 5000)
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  }

  return (
    <div className='flex flex-wrap justify-between sm:items-center max-sm:flex-col gap-y-4'>
      <div className='flex flex-col items-start gap-1'>
        <div className='flex items-center gap-2'>
          <Typography variant='h5'>{`Commande ORD-${order?.slice(0, 6).toUpperCase()}`}</Typography>
        </div>
        <Typography>{`${dayjs(orderData?.createdAt).format('DD/MM/YYYY, HH:mm:ss')}`}</Typography>
      </div>
      <div className='flex gap-2'>
        {['confirmed', 'pending'].includes(orderData?.status) && (
          <Button variant='contained' color='primary'
            onClick={() => setOpenReminder(true)}>
            Rappel au client
          </Button>
        )}
        {['confirmed', 'pending'].includes(orderData?.status) && (
          <Button variant='contained' color='error'
            onClick={() => setOpenCancel(true)}>
            Annuler la commande
          </Button>
        )}
        {['confirmed', 'shipped', 'delivered', 'cancelled', 'pending'].includes(orderData?.status) && (
          <>
          <Button variant='contained' color='primary'
            onClick={handleConfirmInvoice}>
            Envoyer un la facture
          </Button>
          <Button variant='contained' color='primary'
            onClick={handleConfirmDownloadInvoice}>
            Voir la facture
          </Button>
          </>
        )}
      </div>
      <Dialog open={openReminder} fullWidth>
        <DialogTitle>Lancer une rappel au client</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Veuillez confirmer votre rappel</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReminder(false)} variant='outlined' color="secondary">Annuler</Button>
          <Button onClick={handleConfirmReminder} variant='contained' color="primary" autoFocus>Confirmer</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCancel} fullWidth>
        <DialogTitle>Annuler la commande</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth placeholder='Veuillez écrire la raison' 
            value={messageCancel} onChange={(e) => setMessageCancel(e.target.value)}
            multiline
            rows={4}
            label={
              <Typography component="span">
                Raison <Typography component="span" color="error" variant=''>*</Typography>
              </Typography>
            }
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)} variant='outlined' color="secondary">Annuler</Button>
          <Button variant='contained' onClick={handleConfirmCancel} color="error" autoFocus>Confirmer</Button>
        </DialogActions>
      </Dialog> 
    </div>
  )
}

export default OrderDetailHeader

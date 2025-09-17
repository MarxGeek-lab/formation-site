"use client"; // Next.js App Router

import { useState } from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  FormGroup, 
  FormControlLabel, 
  Checkbox 
} from "@mui/material";


const ConfirmationDialog = ({ title, message, checkbox, onConfirm, onCancel }) => {
  const [open, setOpen] = useState(true);
  const [byEmail, setByEmail] = useState(true);
  const [bySMS, setBySMS] = useState(false);

  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    setOpen(false);
    if (onConfirm) onConfirm({ byEmail, bySMS });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title || "Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message || "Choisissez comment envoyer la notification :"}</DialogContentText>
        {checkbox && (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={byEmail} onChange={e => setByEmail(e.target.checked)} />}
              label="Envoyer par Email"
            />
            <FormControlLabel
              control={<Checkbox checked={bySMS} onChange={e => setBySMS(e.target.checked)} />}
              label="Envoyer par SMS"
            />
          </FormGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Annuler</Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>Confirmer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

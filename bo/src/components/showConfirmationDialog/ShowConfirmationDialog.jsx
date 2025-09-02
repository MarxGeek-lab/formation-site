"use client"; // Next.js App Router

import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    setOpen(false);
    if (onConfirm) onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title || "Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message || "Êtes-vous sûr de vouloir continuer ?"}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Annuler</Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>Confirmer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

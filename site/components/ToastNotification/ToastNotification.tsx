"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { createRoot, Root } from "react-dom/client";

interface ToastProps {
  message: string;
  severity: AlertColor;
  duration: number;
  onClose: () => void;
}

let root: Root | null = null;

const Toast: React.FC<ToastProps> = ({ message, severity, duration, onClose }) => (
  <Snackbar 
    open={true} 
    autoHideDuration={duration} 
    onClose={onClose} 
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

const showToast = (
  message: string, 
  severity: AlertColor = "success", 
  duration: number = 5000
): void => {
  if (!root) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    root = createRoot(div);

    const handleClose = (): void => {
      if (root) {
        root.unmount();
        document.body.removeChild(div);
        root = null;
      }
    };

    root.render(
      <Toast 
        message={message} 
        severity={severity} 
        duration={duration} 
        onClose={handleClose} 
      />
    );
  }
};

export { showToast };
export type { ToastProps };

"use client";

import { Snackbar, Alert } from "@mui/material";
import { createRoot } from "react-dom/client";

let root = null;

const Toast = ({ message, severity, duration, onClose }) => (
  <Snackbar open={true} autoHideDuration={duration} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

const showToast = (message, severity = "success", duration = 3000) => {
  if (!root) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    root = createRoot(div);

    const handleClose = () => {
      root.unmount();
      document.body.removeChild(div);
      root = null;
    };

    root.render(<Toast message={message} severity={severity} duration={duration} onClose={handleClose} />);
  }
};

export { showToast };

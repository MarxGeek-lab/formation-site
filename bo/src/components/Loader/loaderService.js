"use client"; // Pour Next.js App Router

import { CircularProgress, Backdrop } from "@mui/material";
import { createRoot } from "react-dom/client";

let root = null;

const Loader = () => (
  <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

const showLoader = () => {
  if (!root) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    root = createRoot(div);
    root.render(<Loader />);
  }
};

const hideLoader = () => {
  if (root) {
    root.unmount();
    root = null;
  }
};

export { showLoader, hideLoader };

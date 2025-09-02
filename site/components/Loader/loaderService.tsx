"use client"; // Pour Next.js App Router

import { CircularProgress, Backdrop } from "@mui/material";
import { createRoot, Root } from "react-dom/client";
import React from "react";

let root: Root | null = null;

const Loader: React.FC = () => (
  <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

const showLoader = (): void => {
  if (!root) {
    const div: HTMLDivElement = document.createElement("div");
    document.body.appendChild(div);
    root = createRoot(div);
    root.render(<Loader />);
  }
};

const hideLoader = (): void => {
  if (root) {
    root.unmount();
    root = null;
  }
};

export { showLoader, hideLoader };

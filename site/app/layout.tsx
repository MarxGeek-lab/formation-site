import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafly - Plateforme de revente de produits numériques",
  description: "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
};

// Since we have a `pages` directory, this layout.tsx file
// is required. https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Rafly - Plateforme de revente de produits numériques",
  description:
    "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
  keywords: [
    "Rafly",
    "revente produits numériques",
    "produits digitaux",
    "marketplace digitale",
    "revendre des ebooks",
    "revendre des logiciels",
    "revendre des formations en ligne",
    "produits numériques rentables",
    "ventes digitales",
    "business en ligne",
    "entrepreneur numérique",
    "startup digitale",
    "marketing digital",
    "plateforme de vente digitale",
    "achats numériques",
    "commerce électronique",
    "revenu passif en ligne",
    "digital assets",
    "ecommerce digital",
    "formation numérique",
    "outils digitaux"
  ],
  authors: [{ name: "Rafly", url: "https://api.rafly.me" }],
  creator: "Rafly",

  openGraph: {
    title: "Rafly - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    url: "https://app.rafly.me",
    siteName: "Rafly",
    images: [
      {
        url: "https://app.rafly.me/logo.webp",
        width: 1200,
        height: 630,
        alt: "Rafly - Marketplace de produits numériques",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rafly - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    site: "@Rafly",
    creator: "@Rafly",
    images: ["https://api.rafly.me/logo-1.webp"],
  },
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

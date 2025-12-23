import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "MarxGeek Academy - Plateforme de revente de produits numériques",
  description:
    "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
  keywords: [
    "MarxGeek Academy",
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
  authors: [{ name: "MarxGeek Academy", url: "https://api.rafly.me" }],
  creator: "MarxGeek Academy",

  openGraph: {
    title: "MarxGeek Academy - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    url: "https://app.rafly.me",
    siteName: "MarxGeek Academy",
    images: [
      {
        url: "https://app.rafly.me/logo.webp",
        width: 1200,
        height: 630,
        alt: "MarxGeek Academy - Marketplace de produits numériques",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MarxGeek Academy - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    site: "@MarxGeek Academy",
    creator: "@MarxGeek Academy",
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

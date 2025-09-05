import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartSidebar from "../../components/CartSidebar";
import NotificationToast from "../../components/NotificationToast";
import ThemeProvider from "../../components/ThemeProvider";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { GlobalProvider } from "@/contexts/GlobalContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode } from "react";
import LocaleProvider from "./LocaleProvider";

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
  authors: [{ name: "Rafly", url: "https://rafly.com" }],
  creator: "Rafly",

  openGraph: {
    title: "Rafly - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    url: "https://rafly.com",
    siteName: "Rafly",
    images: [
      {
        url: "https://rafly.com/og-image.png",
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
    images: ["https://rafly.com/og-image.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#1A202C',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const resolvedParams = await params;
  const {locale} = resolvedParams;

  return (
    <html lang={locale} data-theme="dark">
      <body
        className={`antialiased`}
      >
        <InitColorSchemeScript />
        <LocaleProvider locale={locale}>
          <ThemeProvider>
            <GlobalProvider>
              <NotificationProvider>
                <CartProvider>
                  <Header locale={locale} />
                  <main>{children}</main>
                  <Footer locale={locale} />
                  <CartSidebar params={{ locale }} />
                  <NotificationToast />
                </CartProvider>
              </NotificationProvider>
            </GlobalProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}


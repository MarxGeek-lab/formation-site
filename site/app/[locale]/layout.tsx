import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ThemeProvider from "../../components/ThemeProvider";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { notFound } from "next/navigation";
import { GlobalProvider } from "@/contexts/GlobalContext";

export const metadata: Metadata = {
  title: "Rafly - Plateforme de revente de produits numériques",
  description: "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const {locale} = await params;
  
  // Validate locale
  const locales = ['fr', 'en'];
  if (!locales.includes(locale)) {
    notFound();
  }
  
  // Get messages for the locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} data-theme="dark">
      <body
        className={`antialiased`}
      >
        <InitColorSchemeScript />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <GlobalProvider>
              <Header locale={locale} />
              <main>{children}</main>
              <Footer locale={locale} />
            </GlobalProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

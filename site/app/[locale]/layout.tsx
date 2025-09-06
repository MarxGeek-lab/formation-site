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


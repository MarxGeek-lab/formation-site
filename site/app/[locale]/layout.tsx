import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EbookSidebar from "../../components/EbookSidebar";
import CartSidebar from "../../components/CartSidebar";
import NotificationToast from "../../components/NotificationToast";
import FloatingContactButtons from "../../components/FloatingContactButtons";
import ThemeProvider from "../../components/ThemeProvider";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { GlobalProvider } from "@/contexts/GlobalContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactNode } from "react";
import LocaleProvider from "./LocaleProvider";
import Script from "next/script";
import { Box } from "@mui/material";
import SocialFloat from "@/components/SocialFloat";
import SessionChecker from "@/components/SessionChecker";

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
    <head>
        {/* Facebook Pixel Script */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', ${"fbPixelId"});
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${"fbPixelId"}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body
        className={`antialiased`}
      >
        <InitColorSchemeScript />
        <LocaleProvider locale={locale}>
          <ThemeProvider>
            <GlobalProvider>
              <NotificationProvider>
                <CartProvider>
                  {/* Session Checker */}
                  <SessionChecker />

                  {/* Sidebar E-Books - Fixed on all pages */}
                  <Box sx={{
                    display: "flex",
                  }}>
                    <EbookSidebar locale={locale} />
                    <Box sx={{position: "relative"}}>
                       {/* Header */}
                      <Header locale={locale} />
                  
                      <Box
                        component="main"
                        sx={{
                          minHeight: '100vh',
                          ml: { xs: 0, lg: '280px' },
                          transition: 'margin 0.3s ease',
                          pt: { xs: '80px', lg: 0 }
                        }}
                      >
                        {children}
                      </Box>

                      {/* Footer */}
                      <Box sx={{ ml: { xs: 0, lg: '280px' } }}>
                        <Footer locale={locale} />
                      </Box>
                    </Box>
                  </Box>
              
                  <CartSidebar params={{ locale }} />
                  <NotificationToast />
                  <FloatingContactButtons />
                  <SocialFloat />
                </CartProvider>
              </NotificationProvider>
            </GlobalProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

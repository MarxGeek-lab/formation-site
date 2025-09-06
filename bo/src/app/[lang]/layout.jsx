// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Component Imports
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { GlobalStoreProvider } from '@/contexts/GlobalContext'

export const metadata = {
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
  authors: [{ name: "Rafly", url: "https://api.rafly.me/logo-1.webp" }],
  creator: "Rafly",

  openGraph: {
    title: "Rafly - Plateforme de revente de produits numériques",
    description:
      "La plateforme n°1 de revente de produits numériques. Accédez à une sélection de produits digitaux rentables, validés par le marché.",
    url: "https://rafly.com",
    siteName: "Rafly",
    images: [
      {
        url: "https://api.rafly.me/logo-1.webp",
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

const RootLayout = async props => {
  const params = await props.params
  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection['fr']

  return (
      <html id='__next' lang={'fr'} dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <GlobalStoreProvider>
            <TranslationWrapper lang={'fr'} namespaces={i18n.locales}>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
          </TranslationWrapper>
        </GlobalStoreProvider>
      </body>
    </html>
  )
}

export default RootLayout;
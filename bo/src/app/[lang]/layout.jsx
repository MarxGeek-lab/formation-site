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
  title: 'Shop3 - Votre boutique en ligne',
  description: 'Découvrez notre sélection de produits exceptionnels sur Shop1, votre boutique e-commerce de confiance.',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A84FF',
  openGraph: {
    type: 'website',
    title: 'Shop3 - Votre boutique en ligne',
    description: 'Découvrez notre sélection de produits exceptionnels sur Shop1, votre boutique e-commerce de confiance.',
    images: 'https://api.shop3.educ-access.com/logo/logo.png',
    url: 'https://shop3.educ-access.com',
    siteName: 'Shop3'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop3 - Votre boutique en ligne',
    description: 'Découvrez notre sélection de produits exceptionnels sur Shop1, votre boutique e-commerce de confiance.',
    images: 'https://api.shop3.educ-access.com/logo/logo.png',
    url: 'https://shop3.educ-access.com'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json'
}

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
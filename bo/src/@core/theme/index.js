// Next Imports
// import { Public_Sans } from 'next/font/google'

// Theme Options Imports
import colorSchemes from './colorSchemes'
import customShadows from './customShadows'
import overrides from './overrides'
import shadows from './shadows'
import spacing from './spacing'
import typography from './typography'
import localFont from 'next/font/local'

// const public_sans = Public_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })

const public_sans = localFont({
  src: [
    { path: "../../assets/fonts/Montserrat/Montserrat-Regular.ttf", weight: "400" },
    { path: "../../assets/fonts/Montserrat/Montserrat-Bold.ttf", weight: "700" }
  ],
  variable: "--font-public-sans"
});

const theme = (settings, mode, direction) => {
  return {
    direction,
    components: overrides(settings.skin),
    colorSchemes: colorSchemes(settings.skin),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: typography(public_sans.style.fontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '47 43 61',
      dark: '225 222 245',
      lightShadow: '47 43 61',
      darkShadow: '19 17 32'
    }
  }
}

export default theme

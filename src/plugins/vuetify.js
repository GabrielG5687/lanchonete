import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  theme: {
    defaultTheme: 'lanchoneteTheme',
    themes: {
      lanchoneteTheme: {
        dark: false,
        colors: {
          primary: '#D32F2F',
          secondary: '#FFA000',
          success: '#4CAF50',
          background: '#F5F5F5',
          surface: '#FFFFFF',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 2,
    },
    VBtn: {
      rounded: 'lg',
      variant: 'flat',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})

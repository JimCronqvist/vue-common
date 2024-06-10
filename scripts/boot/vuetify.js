// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';


const vuetify = createVuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    defaultTheme: 'dark',
    options: {
      customProperties: true,
    },
    themes: {
      /*
      light: {
        primary: '#009183',
        secondary: '#373232',
        accent: '#004d40',
      },
      */
    },
  }
});

export function boot({ app }) {
  app.use(vuetify);
  return { vuetify };
}

export default vuetify;

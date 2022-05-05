import '@mdi/font/css/materialdesignicons.css';
import Vuetify from 'vuetify/lib/framework';

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
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
  app.use(Vuetify);
  return { vuetify };
}

export default vuetify;
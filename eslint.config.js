import js from "@eslint/js";
import pluginVue from 'eslint-plugin-vue';
import * as parserVue from 'vue-eslint-parser';
import pluginVuetify from 'eslint-plugin-vuetify';

const config = [
  {
    rules: {
      ...js.configs.recommended.rules,
      'no-console': import.meta.env?.PROD ? 'off' : 'off', // error on prod?
      'no-debugger': import.meta.env?.PROD ? 'error' : 'off',
      'no-unused-vars': 'off',
      'no-prototype-builtins': 'off',
      'no-undef': 'off',
      'vue/no-unused-components': import.meta.env?.PROD ? 'error' : 'off',
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      globals: {},
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
      vuetify: pluginVuetify,
    },
    processor: pluginVue.processors.vue,
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs['vue3-essential'].rules,
      ...pluginVue.configs['vue3-strongly-recommended'].rules,
      ...pluginVue.configs['vue3-recommended'].rules,
      ...pluginVuetify.configs.base.rules,
      ...pluginVuetify.configs.recommended.rules,
      'vue/multi-word-component-names': 0,
      'vue/attributes-order': 0,
      'vue/max-attributes-per-line': 0,
      'vue/v-slot-style': 0,
      'vue/no-template-shadow': 'warn',
      'vuetify/no-deprecated-props': 'warn',
      'vuetify/no-deprecated-classes': 'warn',
      'vuetify/no-deprecated-slots': 'warn',
      'vuetify/no-deprecated-events': 'warn',
    },
  },
];

//console.log(config);

export default config;

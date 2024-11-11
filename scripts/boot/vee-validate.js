import i18n from './i18n';

import { defineRule, configure, normalizeRules, Form, Field, ErrorMessage } from 'vee-validate';

import { all } from '@vee-validate/rules';
//import { required, email, min, max, min_value, max_value, confirmed } from '@vee-validate/rules';

// @todo Fix dynamic import of locales
import en from '@vee-validate/i18n/dist/locale/en.json';
import sv from '@vee-validate/i18n/dist/locale/sv.json';

// Define all rules
if (typeof all === 'object') {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);
  });
} else {
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('max', max);
  defineRule('min_value', min_value);
  defineRule('max_value', max_value);
  defineRule('confirmed', confirmed);
}

// Configure default messages
configure({
  generateMessage: (ctx, values) => {
    if(customRuleMessages.hasOwnProperty(ctx.rule.name)) {
      return customRuleMessages[ctx.rule.name](ctx);
    }
    return i18n.global.t(`validations.${ctx.rule.name}`, [(ctx.label || ctx.name), ...ctx.rule.params])
  },
});

export function convertVeeI18nToVueI18nMessages(messages) {
  const transformed = {};
  for (const key in messages) {
    transformed[key] = messages[key]
      .replace(/(\d):\{\w+\}/g, function(matches) {
        return `{${parseInt(matches[0], 10)+1}}`;
      })
      .replace('{field}', '{0}');
  }
  return transformed;
}

export function boot({ app }) {
  i18n.global.mergeLocaleMessage('sv-SE', { validations: convertVeeI18nToVueI18nMessages(sv.messages) });
  i18n.global.mergeLocaleMessage('en-US', { validations: convertVeeI18nToVueI18nMessages(en.messages) });

  //app.component('VeeForm', Form); // Previously known as ValidationObserver in older versions
  //app.component('VeeField', Field); // Previously known as ValidationProvider in older versions
  //app.component('VeeErrorMessage', ErrorMessage);
}

const customRuleMessages = {};

export function defineRuleAndMessages(name, validator, message) {
  defineRule(name, validator);
  defineRuleMessage(name, message);
}

export function defineRuleMessage(name, message) {
  if(typeof message === 'string') {
    message = () => message;
  }
  if(message instanceof Function) {
    customRuleMessages[name] = message;
  } else {
    Object.entries(message).forEach(([locale, message]) => {
      i18n.global.mergeLocaleMessage(locale, { validations: {[name]: convertVeeI18nToVueI18nMessages(message)} });
    });
  }
}

export { i18n };


/**
 * Dynamically imports locale JSON files via Vite's `import.meta.glob`.
 * This gets replaced statically during build and development by Vite.
 * This allows us to load only the locale files we need at runtime.
 * Extend by adding your own function like this, and re-use the remaining functions.
 */
export function getLocaleFileImports() {
  // Absolute path is relative to the project root
  return import.meta.glob(['/src/locales/*.json', '/locales/*.json']);
}

/**
 * Parse the paths from the locale file import object and build a map like:
 * {
 *    'en-US': () => import('/src/locales/en-US.json',
 *    'sv-SE': () => import('/src/locales/en-US.json', ...
 * }
 *
 * Use with `import.meta.glob` to dynamically import locale files. See getLocaleFileImports().
 * Example: buildLocaleImportMap(getLocaleFileImports())
 *
 * @param {Record<string, () => Promise<any>>} localeFileImports - result from `import.meta.glob`
 * @return {Record<string, () => Promise<any>>} - e.g. { "en-US": fn, "fr-FR": fn }
 */
export function buildLocaleImportMap(localeFileImports) {
  const localeMap = {};
  for(const path in localeFileImports) {
    const match = path.match(/([A-Za-z0-9-_]+)\.json$/i); // Example: /src/locales/en-US.json
    if(match) {
      const locale = match[1]; // Example: 'en-US'
      localeMap[locale] = localeFileImports[path];
    }
  }
  return localeMap;
}

/**
 * Returns an array of all supported locales from our dynamic imports locale map.
 */
export function getLocalesFromLocaleMap(localeImportMap) {
  return Object.keys(localeImportMap);
}

/**
 * Returns an array of all supported locales from our dynamic imports locale map.
 * Assumes the getLocaleFileImports() function, if you have you own version, you can use the full version and replace
 * as necessary:
 * const supportedLocales = getSupportedLocalesFromLocaleMap(buildLocaleImportMap(getLocaleFileImports()));
 *
 * @returns {string[]}
 */
export function getSupportedLocales() {
  const localeImportMap = buildLocaleImportMap(getLocaleFileImports());
  return getLocalesFromLocaleMap(localeImportMap);
}

/**
 * Returns the language portion from a locale string, e.g. "en" from "en-US"
 */
export function getLanguageFromLocale(locale) {
  return locale.split('-')[0];
}

/**
 * Returns a locale matched by the browser language settings.
 */
export function getBrowserLocale(supportedLocales) {
  // Check full browser language match
  const browserLangFull = navigator.language || '';
  if(supportedLocales.includes(browserLangFull)) {
    return browserLangFull;
  }

  // Check partial browser language match
  const browserLangPartial = browserLangFull.split('-')[0];
  if(supportedLocales.includes(browserLangPartial)) {
    return browserLangPartial;
  }

  // Check partial language match for locales that might have different region codes. e.g. "en" in "en-GB".
  const partialMatch = supportedLocales.find(locale => locale.split('-')[0] === browserLangPartial);
  if(partialMatch) {
    return partialMatch;
  }

  return null;
}

/**
 * Returns the default locale from the environment variable or falls back to the first supported locale.
 */
export function getDefaultLocale(supportedLocales) {
  const envLocale = import.meta.env.VITE_I18N_LOCALE || 'en-US';
  if(supportedLocales.includes(envLocale)) {
    return envLocale;
  }
  return supportedLocales[0] || 'en-US';
}

export function getLocale(preferredLocale, supportedLocales) {
  // Check if the preferred locale is supported. Typically, this is the store's locale.
  if(supportedLocales.includes(preferredLocale)) {
    return preferredLocale;
  }

  // Get the browser's preferred locale.
  const browserLocale = getBrowserLocale(supportedLocales);
  if(browserLocale) {
    return browserLocale;
  }

  // If no match is found, fall back to the default locale.
  return getDefaultLocale(supportedLocales);
}

export function getBaseLocale() {
  return getLocale(null, getSupportedLocales());
}

export function mergeI18nLocaleMessages(i18n, locale, messages) {
  // Merge the new locale messages into the i18n instance
  i18n.global.mergeLocaleMessage(locale, messages);
}

export function changeVueI18nLocale(i18n, locale, messages) {
  // Merge the new locale messages into the i18n instance
  mergeI18nLocaleMessages(i18n, locale, messages);

  // Set the i18n instance's locale to the new locale
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
}

export function setHtmlLangAttribute(locale) {
  document.querySelector('html').setAttribute('lang', locale);
}

export function setAxiosAcceptLanguageHeader(axios, locale) {
  if (axios) {
    axios.defaults.headers.common['Accept-Language'] = locale;
  } else {
    console.warn('setAxiosAcceptLanguageHeader: axios instance not available; "Accept-Language" header not set.');
  }
}

/**
 * Loads the locale json messages for a given locale and sets i18n's active locale.
 * Optionally, sets the provided axios instance Accept-Language header.
 */
export async function changeI18nLocale(i18n, locale, axios) {
  const localeImportMap = buildLocaleImportMap(getLocaleFileImports());

  const supportedLocales = getSupportedLocales(localeImportMap);
  if (!supportedLocales.includes(locale)) {
    return Promise.reject(new Error(`changeI18nLocale: Unsupported locale "${locale}"`));
  }

  const localeImport = localeImportMap[locale];
  if (!localeImport) {
    return Promise.reject(new Error(`changeI18nLocale: No import found for locale "${locale}"`));
  }

  // Dynamically import the locale json file
  const messagesModule = await localeImport();
  changeVueI18nLocale(i18n, locale, messagesModule.default);

  // Set the Accept-Language header for axios
  setAxiosAcceptLanguageHeader(axios, locale);

  // Set the document's lang attribute
  setHtmlLangAttribute(locale);

  return locale;
}

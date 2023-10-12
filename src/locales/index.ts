import translationsEN from '/src/locales/en.json?raw'
import translationsFR from '/src/locales/fr.json?raw'

export * from './dictionaries'

const translations = {
  fr: JSON.parse(translationsFR),
  en: JSON.parse(translationsEN),
}

export const translate = (value: string) => {
  const locale = getBrowserLocale(true)

  if (locale === 'fr' && value in translations.fr) {
    return translations.fr[value]
  }

  if (value in translations.en) {
    return translations.en[value]
  }

  return value
}

export const getBrowserLocale = (languageCodeOnly: boolean = false) => {
  if (typeof navigator === 'undefined' || !navigator?.language) {
    return undefined
  }

  const trimmedLocale = navigator.language.trim()

  return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
}

export const getBrowserLocales = (languageCodeOnly = false) => {
  if (!navigator) {
    return undefined
  }

  const browserLocales = navigator.languages ?? [navigator.language]

  if (!browserLocales) {
    return undefined
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()

    return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}

export const numberToLocaleString = (
  value: number,
  options: {
    locale?: string
    precision?: number
  } = {},
) =>
  value.toLocaleString(
    options.locale ||
      (typeof navigator !== 'undefined' ? navigator.language : 'en-US'),
    {
      minimumFractionDigits: options.precision || 0,
      maximumFractionDigits: options.precision || 0,
    },
  )

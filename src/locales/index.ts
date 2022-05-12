export const getBrowserLocale = (languageCodeOnly: boolean = false) => {
  if (!navigator.language) {
    return undefined
  }

  const trimmedLocale = navigator.language.trim()

  return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
}

export const getBrowserLocales = (languageCodeOnly = false) => {
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
  } = {}
) =>
  value.toLocaleString(options.locale || navigator.language, {
    minimumFractionDigits: options.precision || 0,
    maximumFractionDigits: options.precision || 0,
  })

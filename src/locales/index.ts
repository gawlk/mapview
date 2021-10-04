export const getBrowserLocale = (languageCodeOnly: boolean = false) => {
  if (!navigator.language) {
    return undefined
  }

  const trimmedLocale = navigator.language.trim()

  return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
}

export const getBrowserLocales = (languageCodeOnly = false) => {
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages

  if (!browserLocales) {
    return undefined
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()

    return languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}

export const numberToLocaleString = (value: number, precision: number = 0) =>
  value.toLocaleString(navigator.language, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

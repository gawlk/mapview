export const getBrowserLocale = (languageCodeOnly = false) => {
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

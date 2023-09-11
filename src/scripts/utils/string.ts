export const cleanString = (s: string) => {
  try {
    return unaccent(decodeURIComponent(escape(s)))
  } catch {
    return unaccent(s)
  }
}

export const unaccent = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '')

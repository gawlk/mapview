import translationsFR from '/src/locales/fr.json?raw'

const fr = JSON.parse(translationsFR) as Record<string, string>

const en = Object.keys(fr).reduce(
  (_en, current) => {
    _en[current] = current
    return _en
  },
  {} as Record<string, string>,
)

export const dictionaries = {
  en,
  fr,
}

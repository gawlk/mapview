import translationsEN from '/src/locales/en.json?raw'
import translationsFR from '/src/locales/fr.json?raw'

const fr = JSON.parse(translationsFR) as Record<string, string>

const en = Object.keys(fr).reduce(
  (_en, current) => {
    if (!(current in _en)) {
      _en[current] = current
    }
    return _en
  },
  JSON.parse(translationsEN) as Record<string, string>,
)

export const dictionaries = {
  en,
  fr,
}

import translationsFR from '/src/locales/fr.json?raw'

const fr = JSON.parse(translationsFR)

const en = Object.keys(fr).reduce((en, current) => {
  en[current] = current
  return en
}, {} as Record<string, string>)

export const dictionaries = {
  en,
  fr,
}

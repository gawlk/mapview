/* @refresh reload */
import { createI18nContext, I18nContext } from '@solid-primitives/i18n'
import { MetaProvider } from '@solidjs/meta'
import routes from '~solid-pages'
import { render } from 'solid-js/web'

import './styles/main.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { dictionaries, getBrowserLocale } from './locales'

const root = document.getElementById('root')

if (root) {
  render(() => {
    const Routes = useRoutes(routes)

    const dictionary = createI18nContext(dictionaries, getBrowserLocale(true))

    return (
      <I18nContext.Provider value={dictionary}>
        <MetaProvider>
          <Router>
            <Routes />
          </Router>
        </MetaProvider>
      </I18nContext.Provider>
    )
  }, root)
}

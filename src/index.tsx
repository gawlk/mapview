/* @refresh reload */
import { I18nContext, createI18nContext, useI18n } from '@solid-primitives/i18n'
import { MetaProvider } from '@solidjs/meta'
import { render } from 'solid-js/web'
import routes from '~solid-pages'

import './styles/main.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { dictionaries } from './locales'

console.log('routes', routes)

const root = document.getElementById('root')

if (root) {
  const Routes = useRoutes(routes)

  const dictionary = createI18nContext(dictionaries)

  render(
    () => (
      <I18nContext.Provider value={dictionary}>
        <MetaProvider>
          <Router>
            <Routes />
          </Router>
        </MetaProvider>
      </I18nContext.Provider>
    ),
    root
  )
}

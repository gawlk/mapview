/* @refresh reload */
import {
  translator,
  type Flatten,
  type Translator,
} from '@solid-primitives/i18n'
import { MetaProvider } from '@solidjs/meta'
import routes from '~solid-pages'
import { render } from 'solid-js/web'

import './styles/main.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { dictionaries, getBrowserLocale } from './locales'

const root = document.getElementById('root')

interface AppState {
  t: Translator<Flatten<typeof dictionaries.en>>
}

const AppContext = createContext<AppState>({} as AppState)

export const useAppState = () => useContext(AppContext)

if (root) {
  render(() => {
    const Routes = useRoutes(routes)

    const t = translator(() => {
      const lang = getBrowserLocale(true) || ''
      return (dictionaries as RecordAny)[lang] || dictionaries.en
    })

    const state: AppState = {
      t,
    }

    return (
      <AppContext.Provider value={state}>
        <MetaProvider>
          <Router>
            <Routes />
          </Router>
        </MetaProvider>
      </AppContext.Provider>
    )
  }, root)
}

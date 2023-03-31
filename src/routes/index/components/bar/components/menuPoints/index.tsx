import { Navigator } from '/src/components'

import Home from './components/home'
import Thresholds from './components/thresholds'
import Values from './components/values'

export default () => {
  return (
    <Navigator
      default="/"
      list={[
        {
          id: '/',
          component: Home,
        },
        {
          id: '/values',
          component: Values,
        },
        {
          id: '/thresholds',
          component: Thresholds,
        },
      ]}
    />
  )
}

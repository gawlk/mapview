import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Dialog } from '/src/components'

import HeavydynCorrections from './components/corrections/heavydyn'
import Units from './components/units'

export default () => {
  const [t] = useI18n()

  return (
    <Dialog
      moveable
      title={t('Configurations')}
      button={{
        leftIcon: IconTablerSettings,
        text: t('Configurations'),
        full: true,
      }}
    >
      <div class="space-y-6">
        <Switch>
          <Match
            when={
              store.selectedProject?.machine === 'Heavydyn' &&
              store.selectedProject
            }
          >
            {(project) => <HeavydynCorrections project={project()} />}
          </Match>
        </Switch>
        <Units />
      </div>
    </Dialog>
  )
}

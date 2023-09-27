import { Dialog } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

import { HeavydynCorrections } from './components/corrections/heavydyn'
import { Units } from './components/units'

export const DialogConfig = () => {
  const { t } = useAppState()

  return (
    <Dialog
      moveable
      closeable
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

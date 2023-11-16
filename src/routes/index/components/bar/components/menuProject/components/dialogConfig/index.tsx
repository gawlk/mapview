import { Dialog } from '/src/components'
import { useAppState } from '/src/index'
import { run } from '/src/scripts'
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
            when={run(() => {
              const selectedProject = store.selectedProject()
              return (
                (selectedProject?.machine === 'Heavydyn' && selectedProject) ||
                undefined
              )
            })}
          >
            {(project) => <HeavydynCorrections project={project()} />}
          </Match>
        </Switch>
        <Units />
      </div>
    </Dialog>
  )
}

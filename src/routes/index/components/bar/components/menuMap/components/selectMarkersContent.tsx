import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { DialogSelect } from '/src/components'

import DotIcon from '/src/assets/svg/custom/dot.svg'

export default () => {
  const [t] = useI18n()

  const state = createMutable({
    pointStateSelected: 0,
    pointStateValues: [t('Number'), t('Value'), t('Empty')],
  })

  createEffect(() => console.log(store.selectedProject?.settings.pointsState))

  createEffect(() => {
    if (store.selectedProject) {
      const pointsState = store.selectedProject.settings.pointsState

      state.pointStateSelected =
        pointsState === 'number' ? 0 : pointsState === 'value' ? 1 : 2
    }
  })

  const setPointsState = (value: string) => {
    const n = state.pointStateValues.indexOf(value)

    if (store.selectedProject) {
      switch (n) {
        case 0:
          store.selectedProject.settings.pointsState = 'number'
          break
        case 1:
          store.selectedProject.settings.pointsState = 'value'
          break
        case 2:
          store.selectedProject.settings.pointsState = 'nothing'
          break
      }
    }
  }

  return (
    <DialogSelect
      button={{
        full: true,
        leftIcon: DotIcon,
      }}
      position="relative"
      options={{
        selected: state.pointStateValues[state.pointStateSelected],
        list: state.pointStateValues,
      }}
      onClose={(value) => value && setPointsState(value)}
    />
  )
}

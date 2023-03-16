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

  createEffect(() => {
    if (store.projects.selected) {
      const pointsState = store.projects.selected.settings.pointsState

      state.pointStateSelected =
        pointsState === 'number' ? 0 : pointsState === 'value' ? 1 : 2
    }
  })

  const setPointsState = (value: string) => {
    const n = state.pointStateValues.indexOf(value)

    if (store.projects.selected) {
      switch (n) {
        case 0:
          store.projects.selected.settings.pointsState = 'number'
          break
        case 1:
          store.projects.selected.settings.pointsState = 'value'
          break
        case 2:
          store.projects.selected.settings.pointsState = 'nothing'
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
      size="small"
      options={{
        selected: state.pointStateValues[state.pointStateSelected],
        list: state.pointStateValues,
      }}
      onClose={(value) => value && setPointsState(value)}
    />
  )
}

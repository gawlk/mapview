import { useI18n } from '@solid-primitives/i18n'

import { DialogSelect } from '/src/components'
import { store } from '/src/store'

export const SelectMarkersContent = () => {
  const [t] = useI18n()

  const markersPossibleStates = [
    {
      value: '0',
      text: t('Number'),
      leftIcon: IconTablerIdBadge2,
    },
    {
      value: '1',
      text: t('Value'),
      leftIcon: IconTabler123,
    },
    {
      value: '2',
      text: t('Empty'),
      leftIcon: IconTablerX,
    },
  ]

  const state = createMutable({
    pointStateSelected: 0,
  })

  createEffect(() => {
    if (store.selectedProject) {
      const pointsState = store.selectedProject.settings.pointsState

      switch (pointsState) {
        case 'number': {
          state.pointStateSelected = 0
          break
        }
        case 'value': {
          state.pointStateSelected = 1
          break
        }
        default: {
          state.pointStateSelected = 2
          break
        }
      }
    }
  })

  const setPointsState = (index: number) => {
    if (store.selectedProject) {
      switch (index) {
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
        size: 'sm',
        leftIcon: markersPossibleStates[state.pointStateSelected].leftIcon,
      }}
      attached
      values={{
        selected: state.pointStateSelected,
        list: markersPossibleStates,
      }}
      onClose={(value) => value && setPointsState(Number(value))}
    />
  )
}

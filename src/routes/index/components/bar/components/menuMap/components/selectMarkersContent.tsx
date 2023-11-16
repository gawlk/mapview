import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { createASS } from '/src/scripts'
import { store } from '/src/store'

export const SelectMarkersContent = () => {
  const { t } = useAppState()

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

  const state = {
    pointStateSelected: createASS<0 | 1 | 2>(0),
  }

  createEffect(() => {
    const selectedProject = store.selectedProject()
    if (selectedProject) {
      const pointsState = selectedProject.settings.pointsState()

      switch (pointsState) {
        case 'number': {
          state.pointStateSelected.set(0)
          break
        }
        case 'value': {
          state.pointStateSelected.set(1)
          break
        }
        default: {
          state.pointStateSelected.set(2)
          break
        }
      }
    }
  })

  const setPointsState = (index: number) => {
    const selectedProject = store.selectedProject()
    if (selectedProject) {
      switch (index) {
        case 0:
          selectedProject.settings.pointsState.set('number')
          break
        case 1:
          selectedProject.settings.pointsState.set('value')
          break
        case 2:
          selectedProject.settings.pointsState.set('nothing')
          break
      }
    }
  }

  return (
    <DialogSelect
      button={{
        full: true,
        size: 'sm',
        leftIcon: markersPossibleStates[state.pointStateSelected()].leftIcon,
      }}
      attached
      values={{
        selected: state.pointStateSelected(),
        list: markersPossibleStates,
      }}
      onClose={(value) => value && setPointsState(Number(value))}
    />
  )
}

import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Button, DialogSelect } from '/src/components'

import DotIcon from '/src/assets/svg/custom/dot.svg'
import DotsIcon from '/src/assets/svg/custom/dots.svg'

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
    <div class="flex space-x-2">
      <DialogSelect
        button={{
          full: true,
          leftIcon: DotIcon,
        }}
        list={{
          selected: state.pointStateValues[state.pointStateSelected],
          values: state.pointStateValues,
        }}
        onClose={(value) => value && setPointsState(value)}
      />
      <Button
        onClick={() =>
          store.projects.selected &&
          (store.projects.selected.settings.arePointsVisible =
            !store.projects.selected.settings.arePointsVisible)
        }
        icon={
          store.projects.selected?.settings.arePointsVisible
            ? IconTablerEye
            : IconTablerEyeOff
        }
      />
      <Button
        onClick={() =>
          store.projects.selected &&
          (store.projects.selected.settings.arePointsLinked =
            !store.projects.selected.settings.arePointsLinked)
        }
        icon={
          store.projects.selected?.settings.arePointsLinked
            ? IconTablerShare
            : DotsIcon
        }
      />
      <Button
        onClick={() =>
          store.projects.selected &&
          (store.projects.selected.settings.arePointsLocked =
            !store.projects.selected.settings.arePointsLocked)
        }
        icon={
          store.projects.selected?.settings.arePointsLocked
            ? IconTablerLock
            : IconTablerLockOpen
        }
      />
    </div>
  )
}

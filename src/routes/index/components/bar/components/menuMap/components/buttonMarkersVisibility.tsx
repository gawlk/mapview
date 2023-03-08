import store from '/src/store'

import { Button } from '/src/components'

export default () => {
  return (
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
  )
}

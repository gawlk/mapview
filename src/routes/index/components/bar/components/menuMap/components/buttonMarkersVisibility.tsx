import store from '/src/store'

import { Button } from '/src/components'

export default () => {
  return (
    <Button
      size="sm"
      onClick={() =>
        store.selectedProject &&
        (store.selectedProject.settings.arePointsVisible =
          !store.selectedProject.settings.arePointsVisible)
      }
      icon={
        store.selectedProject?.settings.arePointsVisible
          ? IconTablerEye
          : IconTablerEyeOff
      }
    />
  )
}

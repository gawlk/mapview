import store from '/src/store'

import { Button } from '/src/components'

export default () => {
  return (
    <Button
      size="sm"
      onClick={() =>
        store.selectedProject &&
        (store.selectedProject.settings.arePointsLocked =
          !store.selectedProject.settings.arePointsLocked)
      }
      icon={
        store.selectedProject?.settings.arePointsLocked
          ? IconTablerLock
          : IconTablerLockOpen
      }
    />
  )
}

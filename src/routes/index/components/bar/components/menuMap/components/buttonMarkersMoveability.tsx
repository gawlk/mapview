import store from '/src/store'

import { Button } from '/src/components'

export default () => {
  return (
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
  )
}

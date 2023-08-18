import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonMarkersMoveability = () => {
  return (
    <Button
      size="sm"
      onClick={() => {
        store.selectedProject &&
          (store.selectedProject.settings.arePointsLocked =
            !store.selectedProject.settings.arePointsLocked)
      }}
      icon={
        store.selectedProject?.settings.arePointsLocked
          ? IconTablerLock
          : IconTablerLockOpen
      }
    />
  )
}

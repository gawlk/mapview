import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonMarkersMoveability = () => {
  return (
    <Button
      size="sm"
      onClick={() => {
        store.selectedProject()?.settings.arePointsLocked.set((b) => !b)
      }}
      icon={
        store.selectedProject()?.settings.arePointsLocked()
          ? IconTablerLock
          : IconTablerLockOpen
      }
    />
  )
}

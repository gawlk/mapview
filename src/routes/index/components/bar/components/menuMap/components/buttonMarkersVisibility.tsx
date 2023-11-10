import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonMarkersVisibility = () => {
  return (
    <Button
      size="sm"
      onClick={() => {
        store.selectedProject()?.settings.arePointsVisible.set((b) => !b)
      }}
      icon={
        store.selectedProject()?.settings.arePointsVisible()
          ? IconTablerEye
          : IconTablerEyeOff
      }
    />
  )
}

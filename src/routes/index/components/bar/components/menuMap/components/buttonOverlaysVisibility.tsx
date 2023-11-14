import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonOverlaysVisibility = () => {
  return (
    <Button
      onClick={() => {
        store.selectedProject()?.settings.areOverlaysVisible.set((b) => !b)
      }}
      icon={
        store.selectedProject()?.settings.areOverlaysVisible()
          ? IconTablerEye
          : IconTablerEyeOff
      }
    />
  )
}

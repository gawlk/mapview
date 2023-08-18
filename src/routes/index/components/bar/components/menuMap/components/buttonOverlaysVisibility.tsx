import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonOverlaysVisibility = () => {
  return (
    <Button
      onClick={() => {
        store.selectedProject &&
          (store.selectedProject.settings.areOverlaysVisible =
            !store.selectedProject.settings.areOverlaysVisible)
      }}
      icon={
        store.selectedProject?.settings.areOverlaysVisible
          ? IconTablerEye
          : IconTablerEyeOff
      }
    />
  )
}

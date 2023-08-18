import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonMarkersVisibility = () => {
  return (
    <Button
      size="sm"
      onClick={() => {
        store.selectedProject &&
          (store.selectedProject.settings.arePointsVisible =
            !store.selectedProject.settings.arePointsVisible)
      }}
      icon={
        store.selectedProject?.settings.arePointsVisible
          ? IconTablerEye
          : IconTablerEyeOff
      }
    />
  )
}

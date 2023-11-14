import DotsIcon from '/src/assets/svg/custom/dots.svg'
import { Button } from '/src/components'
import { store } from '/src/store'

export const ButtonLineVisibility = () => {
  return (
    <Button
      size="sm"
      onClick={() => {
        store.selectedProject()?.settings.arePointsLinked.set((b) => !b)
      }}
      icon={
        store.selectedProject()?.settings.arePointsLinked()
          ? IconTablerShare
          : DotsIcon
      }
    />
  )
}

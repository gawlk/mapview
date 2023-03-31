import store from '/src/store'

import { Button } from '/src/components'

import DotsIcon from '/src/assets/svg/custom/dots.svg'

export default () => {
  return (
    <Button
      onClick={() =>
        store.selectedProject &&
        (store.selectedProject.settings.arePointsLinked =
          !store.selectedProject.settings.arePointsLinked)
      }
      icon={
        store.selectedProject?.settings.arePointsLinked
          ? IconTablerShare
          : DotsIcon
      }
    />
  )
}

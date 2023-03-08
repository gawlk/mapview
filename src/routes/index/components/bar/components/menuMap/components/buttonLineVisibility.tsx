import store from '/src/store'

import { Button } from '/src/components'

import DotsIcon from '/src/assets/svg/custom/dots.svg'

export default () => {
  return (
    <Button
      onClick={() =>
        store.projects.selected &&
        (store.projects.selected.settings.arePointsLinked =
          !store.projects.selected.settings.arePointsLinked)
      }
      icon={
        store.projects.selected?.settings.arePointsLinked
          ? IconTablerShare
          : DotsIcon
      }
    />
  )
}

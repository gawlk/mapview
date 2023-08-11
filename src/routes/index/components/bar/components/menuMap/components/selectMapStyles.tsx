import { store } from '/src/store'

import { DialogSelect } from '/src/components'

import mapboxDarkStyle from '/src/assets/png/mapboxStyles/dark.png'
import mapboxLightStyle from '/src/assets/png/mapboxStyles/light.png'
import mapboxOutdoorsStyle from '/src/assets/png/mapboxStyles/outdoors.png'
import mapboxSatelliteStyle from '/src/assets/png/mapboxStyles/satellite.png'
import mapboxStreetsStyle from '/src/assets/png/mapboxStyles/streets.png'

export const SelectMapStyle = () => {
  const stylesImages = [
    mapboxStreetsStyle,
    mapboxOutdoorsStyle,
    mapboxSatelliteStyle,
    mapboxLightStyle,
    mapboxDarkStyle,
  ]

  const background = createMemo(
    () => stylesImages[store.selectedProject?.settings.map.styleIndex || 0],
  )

  return (
    <DialogSelect
      button={{
        leftIcon: IconTablerColorSwatch,
        class: 'bg-cover bg-center text-transparent',
        style: { 'background-image': `url('${background()}')` },
        full: true,
      }}
      attached
      values={{
        selected: 0,
        list: stylesImages.map((style, index) => ({
          value: String(index),
          class: 'bg-cover bg-center text-transparent',
          style: { 'background-image': `url('${style}')` },
        })),
      }}
      onClose={(index) => {
        if (index && store.selectedProject) {
          store.selectedProject.settings.map.styleIndex = Number(index)
        }
      }}
    />
  )
}

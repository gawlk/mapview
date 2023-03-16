import store from '/src/store'

import { Button } from '/src/components'

interface Props {
  overlay: Overlay
}

export default (props: Props) => {
  return (
    <Button
      full
      onClick={() => {
        const nw = props.overlay.markerNW.getLngLat()
        const se = props.overlay.markerSE.getLngLat()

        store.map?.fitBounds(
          [
            [
              nw.lng < se.lng ? nw.lng : se.lng,
              nw.lat < se.lat ? nw.lat : se.lat,
            ], // southwestern corner of the bounds
            [
              nw.lng > se.lng ? nw.lng : se.lng,
              nw.lat > se.lat ? nw.lat : se.lat,
            ], // northeastern corner of the bounds
          ],
          { padding: 100 }
        )
      }}
    >
      {props.overlay.id.split('.')[0]}
    </Button>
  )
}

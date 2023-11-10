import { Button } from '/src/components'
import { store } from '/src/store'

interface Props {
  readonly overlay: Overlay
}

export const ButtonFitOverlay = (props: Props) => {
  return (
    <Button
      full
      onClick={() => {
        const { markerNW, markerSE } = props.overlay

        if (!markerNW || !markerSE) return

        const nw = markerNW.getLngLat()
        const se = markerSE.getLngLat()

        store.map()?.fitBounds(
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
          { padding: 100 },
        )
      }}
    >
      <span class="truncate">{props.overlay.id.split('.')[0]}</span>
    </Button>
  )
}

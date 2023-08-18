import { Button } from '/src/components'
import { store } from '/src/store'

interface Props {
  overlay: Overlay
}

export const ButtonRemoveOverlay = (props: Props) => {
  return (
    <Button
      icon={IconTablerTrash}
      onClick={() => {
        const index = store.selectedProject?.overlays.findIndex(
          (overlay) => props.overlay === overlay,
        )

        if (typeof index === 'number' && index !== -1) {
          store.selectedProject?.overlays.splice(index, 1)?.[0]?.remove()
        }
      }}
    />
  )
}

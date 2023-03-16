import store from '/src/store'

import { Button } from '/src/components'

interface Props {
  overlay: Overlay
}

export default (props: Props) => {
  return (
    <Button
      icon={IconTablerTrash}
      onClick={() => {
        const index = store.selectedProject?.overlays.findIndex(
          (overlay) => props.overlay === overlay
        )

        if (typeof index === 'number' && index !== -1) {
          store.selectedProject?.overlays.splice(index, 1)?.[0]?.remove()
        }
      }}
    />
  )
}

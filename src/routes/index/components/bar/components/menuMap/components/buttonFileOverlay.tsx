import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { convertFileToDataURL, createOverlay } from '/src/scripts'

import { ButtonFile } from '/src/components'

export const ButtonFileOverlay = () => {
  const [t] = useI18n()

  const hasOverlays = createMemo(() => store.selectedProject?.overlays.length)

  return (
    <ButtonFile
      {...(!hasOverlays() ? { leftIcon: IconTablerPhoto, full: true } : {})}
      onFiles={async (files) => {
        const file = files?.[0]

        if (file && store.selectedProject) {
          const data64 = await convertFileToDataURL(file)

          const overlay = await createOverlay(data64, store.map, {
            version: 1,
            name: file.name,
          })

          store.selectedProject.overlays.push(overlay)

          overlay.addToMap(store.selectedProject.settings.areOverlaysVisible)
        }
      }}
    >
      {/* <Show> isn't used on purpose here, `props.children` would still be defined if it was */}
      {!hasOverlays() ? (
        <span class="flex-1 text-left">{t('Add an image')}</span>
      ) : undefined}
    </ButtonFile>
  )
}

import { ButtonFile } from '/src/components'
import { useAppState } from '/src/index'
import { convertFileToDataURL, createOverlay } from '/src/scripts'
import { store } from '/src/store'

export const ButtonFileOverlay = () => {
  const { t } = useAppState()

  const hasOverlays = createMemo(
    () => store.selectedProject()?.overlays().length,
  )

  return (
    <ButtonFile
      {...(!hasOverlays() ? { leftIcon: IconTablerPhoto, full: true } : {})}
      // eslint-disable-next-line solid/reactivity
      onFiles={async (files) => {
        const file = files?.[0]

        const selectedProject = store.selectedProject()

        if (file && selectedProject) {
          const data64 = await convertFileToDataURL(file)

          const overlay = await createOverlay(
            data64,
            store.map(),
            {
              version: 1,
              name: file.name,
            },
            selectedProject,
          )

          selectedProject.overlays.set((l) => {
            l.push(overlay)
            return l
          })
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

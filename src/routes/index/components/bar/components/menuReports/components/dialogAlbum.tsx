import { Button, Dialog } from '/src/components'
import { useAppState } from '/src/index'
import { downloadImage } from '/src/scripts'
import { store } from '/src/store'

import { Image } from './image'

export const DialogAlbum = () => {
  const { t } = useAppState()

  return (
    <Dialog
      closeable
      maximized
      button={{
        leftIcon: IconTablerSlideshow,
        text: `${t('View the album')} - ${store.selectedReport?.screenshots
          .length}`,
        full: true,
      }}
      title={t('Album')}
    >
      <div class="flex h-full items-center space-x-4 overflow-x-auto px-6">
        {/* TODO: Rename screenshots to album */}
        <For each={store.selectedReport?.screenshots}>
          {(image, index) => (
            <div class="mx-auto flex-none space-y-8">
              <Image image={image} />
              <div class="flex justify-center space-x-2">
                <div class="inline-block space-x-2">
                  <Button
                    leftIcon={IconTablerCameraDown}
                    onClick={() => {
                      void downloadImage(image)
                    }}
                  >
                    {t('Download')}
                  </Button>
                  <Button
                    color="red"
                    leftIcon={IconTablerCameraCancel}
                    onClick={() =>
                      store.selectedReport?.screenshots.splice(index(), 1)
                    }
                  >
                    {t('Delete')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </Dialog>
  )
}

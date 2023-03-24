import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { downloadImage } from '/src/scripts'

import Image from './image'

import { Button, Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

  return (
    <Dialog
      position="full"
      color="transparent"
      button={{
        leftIcon: IconTablerSlideshow,
        text: `${t('View the album')} - ${
          store.selectedReport?.screenshots.length
        }`,
        full: true,
      }}
      title={t('Album')}
    >
      <div class="flex h-full items-center space-x-2 overflow-x-auto px-6">
        {/* TODO: Rename screenshots to album */}
        <For each={store.selectedReport?.screenshots}>
          {(image, index) => (
            <div class="mx-auto flex-none space-y-2">
              <Image image={image} />
              <div class="flex justify-center space-x-2">
                <div class="inline-block space-x-2">
                  <Button
                    leftIcon={IconTablerCameraDown}
                    onClick={() => downloadImage(image)}
                  >
                    {t('Download picture')}
                  </Button>
                  <Button
                    leftIcon={IconTablerCameraCancel}
                    onClick={() =>
                      store.selectedReport?.screenshots.splice(index(), 1)
                    }
                  >
                    {t('Remove from album')}
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

import { useI18n } from '@solid-primitives/i18n'
import html2canvas from 'html2canvas'

import { Button, Dialog } from '/src/components'
import { downloadImage } from '/src/scripts'
import { store } from '/src/store'

import { Image } from './image'

export const DialogScreenshot = () => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    image: null as string | null,
    isAlbumOpen: false,
    screenshooting: false,
  })

  const screenshot = async () => {
    setState('screenshooting', true)

    const map = document.getElementById('map') as HTMLElement

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.add('hidden')

    Array.from(map.getElementsByClassName('mapview-icon')).forEach((icon) => {
      ;(icon as HTMLSpanElement).style.marginBottom = '1rem'
    })

    const canvas = await html2canvas(map, {
      logging: false,
    })

    Array.from(map.getElementsByClassName('mapview-icon')).forEach((icon) => {
      ;(icon as HTMLSpanElement).style.marginBottom = ''
    })

    map
      .getElementsByClassName('mapboxgl-control-container')[0]
      .classList.remove('hidden')

    setState({
      screenshooting: false,
      image: canvas.toDataURL('image/jpeg', map?.clientWidth > 1000 ? 0.75 : 1),
    })
  }

  let closeDialog = undefined as undefined | DialogCloseFunction

  return (
    <Dialog
      color="transparent"
      maximized
      button={{
        ...(store.selectedReport?.screenshots.length
          ? { icon: IconTablerCamera }
          : {
              leftIcon: IconTablerCamera,
              text: t('Take a screenshot'),
              full: true,
            }),
        onClick: () => {
          void screenshot()
        },
      }}
      onClose={() => setState('image', null)}
      title={t('Screenshot')}
      onCloseCreated={(_closeDialog) => {
        closeDialog = _closeDialog
      }}
      form={
        <div class="flex h-full items-center justify-center">
          <Show when={state.image}>
            {(image) => (
              <div class="space-y-8">
                <Image image={image()} />
                <div class="flex justify-center space-x-2">
                  <div class="inline-block space-x-2">
                    <Button
                      color="green"
                      leftIcon={IconTablerCameraCheck}
                      onClick={() =>
                        store.selectedReport?.screenshots.push(image())
                      }
                    >
                      {t('Add to album')}
                    </Button>
                    <Button
                      color="yellow"
                      leftIcon={IconTablerCameraDown}
                      onClick={() => {
                        void downloadImage(image())
                      }}
                    >
                      {t('Download picture')}
                    </Button>
                    <Button
                      leftIcon={IconTablerDoorExit}
                      color="red"
                      onClick={() => {
                        closeDialog?.()
                      }}
                    >
                      {t('Exit')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Show>
        </div>
      }
    />
  )
}

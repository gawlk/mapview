import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { colors } from '/src/scripts'

import { Button, Container, Dialog, DialogColor, Input } from '/src/components'

export const DialogZoneSettings = () => {
  const [t] = useI18n()

  return (
    <Dialog
      closeable
      button={{ leftIcon: IconTablerCircleDotted, full: true }}
      moveable
      title={t('Zone settings')}
    >
      <div class="space-y-2">
        <For each={store.selectedReport?.zones}>
          {(zone, index) => (
            <Container
              class="flex space-x-1.5"
              size="xs"
              color="transparent"
              style={{
                'background-color': `${colors[zone.settings.color]}66`,
              }}
            >
              <DialogColor
                selected={zone.settings.color}
                onClose={(color?: string) =>
                  color && (zone.settings.color = color as ColorName)
                }
                button={{
                  text: '',
                  class: 'h-full',
                }}
              />
              <Input
                id={`zone-${zone.name}-name`}
                value={zone.name}
                leftIcon={IconTablerIdBadge}
                full
                onInput={(value) => (zone.name = value || '')}
              />
              <Show when={index()}>
                <Button
                  icon={IconTablerTrash}
                  onClick={() => {
                    const { selectedReport } = store

                    ;(selectedReport?.zones[0].points as BasePoint[]).push(
                      ...zone.points.map((point) => {
                        if (selectedReport) {
                          point.zone = selectedReport.zones[0]
                        }
                        return point
                      })
                    )

                    zone.clean()

                    selectedReport?.zones.splice(index(), 1)
                  }}
                />
              </Show>
            </Container>
          )}
        </For>
        <Button
          full
          leftIcon={IconTablerPlus}
          onClick={() => store.selectedReport?.addZone()}
        >
          {t('Create a zone')}
        </Button>
      </div>
    </Dialog>
  )
}

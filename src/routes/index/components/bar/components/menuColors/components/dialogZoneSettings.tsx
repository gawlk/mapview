import { useI18n } from '@solid-primitives/i18n'

import { Button, Dialog, DialogColor, Input } from '/src/components'
import { colors } from '/src/scripts'
import { store } from '/src/store'

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
            <div class="flex space-x-1.5">
              <DialogColor
                selected={zone.settings.color}
                onClose={(color?: string) => {
                  color && (zone.settings.color = color as ColorName)
                }}
                button={{
                  text: '',
                  class: 'h-full',
                  style: {
                    'background-color': `${colors[zone.settings.color]}66`,
                  },
                }}
              />
              <Input
                id={`zone-${zone.name}-name`}
                value={zone.name}
                leftIcon={IconTablerIdBadge}
                full
                onInput={(value) => {
                  zone.name = value || ''
                }}
                style={{
                  'border-color': `${colors[zone.settings.color]}66`,
                  'background-color': 'white',
                }}
              />
              <Show when={index()}>
                <Button
                  icon={IconTablerTrash}
                  style={{
                    'background-color': `${colors[zone.settings.color]}66`,
                  }}
                  onClick={() => {
                    const { selectedReport } = store

                    if (!selectedReport) return

                    const zone0 = selectedReport?.zones[0]

                    if (zone0 === zone) return

                    const points = zone0.points as BasePoint[]

                    zone.clean()

                    selectedReport.zones.splice(index(), 1)

                    batch(() =>
                      points.push(
                        ...zone.points.map((point) => {
                          if (selectedReport) {
                            point.zone = zone0
                          }
                          return point
                        }),
                      ),
                    )

                    points.forEach((p) => p.addToMap())
                  }}
                />
              </Show>
            </div>
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

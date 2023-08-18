import { useI18n } from '@solid-primitives/i18n'
import {
  Button,
  Dialog,
  DialogDivider,
  DialogSelect,
  Interactive,
} from '/src/components'
import { run } from '/src/scripts'
import { store } from '/src/store'

export const DialogEntity = () => {
  const [t] = useI18n()

  const dialogEntityButtonId = 'dialog-marker-button'

  createEffect(
    on(
      () => store.dialogEntity,
      (entity, previous) => {
        if (entity && !previous) {
          const button = document.getElementById('dialog-marker-button')

          button?.click()
        }
      },
    ),
  )

  const creaseEntity = (crease: -1 | 1) => {
    const len = store.dialogEntity?.zone.report.line.sortedPoints.length || 0

    let index = (store.dialogEntity?.index || 0) + crease

    if (index >= len) {
      index = 0
    } else if (index < 0) {
      index = len - 1
    }

    const point = store.dialogEntity?.zone.report.line.sortedPoints[index]

    if (point) {
      store.dialogEntity = point as MachinePoint
    }
  }

  return (
    <Dialog
      closeable
      button={{
        class: 'hidden',
        id: dialogEntityButtonId,
      }}
      title={`${t('Point')} - ${t('Data')}`}
      onCloseEnd={() => {
        store.dialogEntity = null
      }}
      sticky={
        <div class="flex space-x-2 px-4">
          <Button icon={IconTablerArrowLeft} onClick={() => creaseEntity(-1)} />
          <DialogSelect
            button={{
              full: true,
              // TODO: Take icon from selected
              leftIcon: store.dialogEntity?.settings.isVisible
                ? IconTablerEye
                : IconTablerEyeOff,
            }}
            attached
            values={{
              selected: store.dialogEntity?.index ?? null,
              list:
                store.dialogEntity?.zone.report.line.sortedPoints.map(
                  (point) => ({
                    leftIcon: point.settings.isVisible
                      ? IconTablerEye
                      : IconTablerEyeOff,
                    value: String(point.index),
                    text: `Point ${point.number} ${
                      point.settings.isVisible ? '' : ` - ${t('Hidden')}`
                    }`,
                  }),
                ) || [],
            }}
            onClose={(value) => {
              const point =
                store.dialogEntity?.zone.report.line.sortedPoints[Number(value)]

              if (point) {
                store.dialogEntity = point as MachinePoint
              }
            }}
          />
          <Button icon={IconTablerArrowRight} onClick={() => creaseEntity(1)} />
        </div>
      }
    >
      <Show when={store.dialogEntity}>
        {(entity) => (
          <div class="space-y-2">
            {/* TODO: Create component between interactive and container */}
            <Interactive
              component="div"
              full
              leftIcon={IconTablerWorldLongitude}
              label={t('Longitude')}
            >
              {entity().marker?.getLngLat().lng.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              }) || ''}
            </Interactive>
            <Interactive
              component="div"
              full
              leftIcon={IconTablerWorldLatitude}
              label={t('Latitude')}
            >
              {entity().marker?.getLngLat().lat.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              }) || ''}
            </Interactive>
            {/* TODO: Fix Y margin */}
            <DialogDivider class="-mx-4" />
            <For each={entity().data}>
              {(dataValue) => (
                <Interactive
                  component="div"
                  full
                  leftIcon={run(() => {
                    switch (dataValue.value.unit.name) {
                      case 'Temperature':
                        return IconTablerTemperature
                      case 'Distance':
                        return IconTablerRuler2
                      default:
                        return IconTablerNumbers
                    }
                  })}
                  label={t(dataValue.label.name)}
                >
                  {dataValue.value.displayedStringWithUnit}
                </Interactive>
              )}
            </For>
          </div>
        )}
      </Show>
    </Dialog>
  )
}

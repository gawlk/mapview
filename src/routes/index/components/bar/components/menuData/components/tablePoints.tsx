// @ts-ignore
import { Sortable } from '@shopify/draggable'
import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { colors, moveIndexInCopiedArray } from '/src/scripts'

import { THead, Table, Td, Tr } from './table'

import { Button, DialogSelect } from '/src/components'

import { movePointToZoneIndex } from './table/scripts'
import TdDataLabel from './table/tdDataLabel'

interface Props {
  points: BasePoint[]
  dataLabels: DataLabel[]
  from?: DataLabelsFrom
  index?: BaseDropIndex
  colored?: boolean
  sortable?: boolean
}

export default (props: Props) => {
  const size = 'sm'

  const [t] = useI18n()

  const getValuesFromPoints = (
    points: BasePoint[],
    dataLabel: DataLabel<string>
  ) =>
    points.map(
      (point) =>
        (props.from &&
          point.getSelectedMathNumber(
            props.from || 'Drop',
            dataLabel,
            props.index
          )?.value) ||
        0
    )

  let sortable: Sortable | undefined
  let tbody: HTMLTableSectionElement | undefined

  onMount(() => {
    if (props.sortable) {
      sortable = new Sortable(tbody, {
        draggable: '.sortable',
        handle: '.handle',
        mirror: {
          constrainDimensions: true,
        },
      }).on('sortable:stop', (event: any) => {
        const { oldIndex, newIndex } = event.data

        if (oldIndex !== newIndex && store.selectedReport) {
          const points = moveIndexInCopiedArray(
            props.points,
            oldIndex,
            newIndex
          )

          let number = 1

          points.forEach((point, index) => {
            point.index = index
            point.number = number

            if (point.settings.isVisible) {
              number++
            }
          })

          store.selectedReport.line.update()
        }
      })
    }
  })

  onCleanup(() => {
    sortable?.destroy()
  })

  return (
    <Table>
      <THead>
        <Td />
        <Td text="center">{t('Zone')}</Td>
        <Td class="w-1/4" text="center">
          {t('Number')}
        </Td>
        <For each={props.dataLabels}>
          {(dataLabel) => (
            <TdDataLabel
              dataLabel={dataLabel}
              values={getValuesFromPoints(
                props.points.filter((point) => point.settings.isVisible),
                dataLabel
              )}
            />
          )}
        </For>
        <Td />
        <Td />
      </THead>
      <tbody ref={tbody}>
        <For each={props.points}>
          {(point) => (
            <Tr
              color={
                props.colored
                  ? point.settings.isVisible && point.icon
                    ? point.icon.color
                    : colors.gray
                  : undefined
              }
              class={[!point.settings.isVisible && 'text-opacity-50']}
            >
              <Td>
                <Button
                  class="handle"
                  size={size}
                  disabled={store.selectedReport?.settings.groupBy === 'Zone'}
                  icon={
                    store.selectedReport?.settings.groupBy === 'Zone'
                      ? IconTablerHandOff
                      : IconTablerHandStop
                  }
                />
              </Td>
              <Td>
                <DialogSelect
                  button={{
                    size,
                    full: true,
                  }}
                  position="relative"
                  options={{
                    selected: point.zone.name,
                    list: (
                      store.selectedReport?.zones.map((zone) => zone.name) || []
                    ).map((text, index) => ({
                      value: String(index),
                      text,
                    })),
                  }}
                  onClose={(index) =>
                    index && movePointToZoneIndex(point, Number(index))
                  }
                />
              </Td>
              <Td wide text="center">
                {point.number}
              </Td>
              <Show when={props.from}>
                {(from) => (
                  <For each={props.dataLabels}>
                    {(dataLabel) => (
                      <Td wide text="right">
                        {point.getDisplayedString(
                          from(),
                          dataLabel,
                          props.index
                        )}
                      </Td>
                    )}
                  </For>
                )}
              </Show>
              <Td>
                <Button
                  size={size}
                  icon={IconTablerZoomIn}
                  onClick={() =>
                    store.map?.flyTo({
                      center: point.marker?.getLngLat(),
                      zoom: 20,
                    })
                  }
                />
              </Td>
              <Td>
                <Button
                  size={size}
                  icon={
                    point.settings.isVisible ? IconTablerEye : IconTablerEyeOff
                  }
                  onClick={() =>
                    (point.settings.isVisible = !point.settings.isVisible)
                  }
                />
              </Td>
            </Tr>
          )}
        </For>
      </tbody>
    </Table>
  )
}

import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { colors, moveIndexInCopiedArray } from '/src/scripts'

import { movePointToZoneIndex } from './scripts'

import {
  Button,
  DialogSelect,
  SortableList,
  THead,
  Table,
  Td,
  TdDataLabel,
  Tr,
} from '/src/components'

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

  return (
    <Table>
      <THead>
        <Td />
        <Td text="center">{t('Zone')}</Td>
        <Td text="right" class="w-1/4" wide>
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
      <tbody>
        <SortableList
          list={props.points}
          itemToId={(point) => point.id}
          draggedClasses={'!bg-gray-100'}
          onChange={(from, to) => {
            if (!store.selectedReport) return

            const points = moveIndexInCopiedArray(props.points, from, to)

            let number = 1

            points.forEach((point, index) => {
              point.index = index
              point.number = number

              if (point.settings.isVisible) {
                number++
              }
            })

            store.selectedReport.line.update()
          }}
          component={(
            ref,
            dragActivators,
            transformStyle,
            point,
            _,
            classes
          ) => (
            <Tr
              ref={ref}
              style={transformStyle()}
              color={
                props.colored
                  ? point.settings.isVisible && point.icon
                    ? point.icon.color
                    : colors.gray
                  : undefined
              }
              class={[
                !point.settings.isVisible && 'text-opacity-50',
                classes(),
              ]}
            >
              <Td>
                <Button
                  {...dragActivators}
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
                  attached
                  values={{
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
              <Td wide text="right">
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
                      zoom: 18,
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
        />
      </tbody>
    </Table>
  )
}

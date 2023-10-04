import {
  Button,
  DialogSelect,
  SortableList,
  Table,
  Td,
  TdDataLabel,
  THead,
  Tr,
} from '/src/components'
import { useAppState } from '/src/index'
import { gray, moveIndexInCopiedArray } from '/src/scripts'
import { store } from '/src/store'

import { movePointToZoneIndex } from './scripts'

interface Props {
  points: BasePoint[]
  dataLabels: DataLabel[]
  cellWidthClass: string
  from?: DataLabelsFrom
  index?: BaseDropIndex
  hideZones?: true
  colored?: boolean
  sortable?: boolean
  showZone?: boolean
}

export const TablePoints = (props: Props) => {
  const size = 'sm'

  const { t } = useAppState()

  const getValuesFromPoints = (
    points: BasePoint[],
    dataLabel: DataLabel<string>,
  ) =>
    points.map(
      (point) =>
        (props.from &&
          point.getSelectedMathNumber(
            props.from || 'Drop',
            dataLabel,
            props.index,
          )?.value) ||
        0,
    )

  return (
    <Table>
      <THead>
        <Td class="hidden lg:table-cell" dataSaveable={false} />
        <Show when={!props.hideZones}>
          <Td text="center" dataSaveable={true}>
            {t('Zone')}
          </Td>
        </Show>
        <Td text="right" class={props.cellWidthClass} wide dataSaveable={true}>
          {t('Number')}
        </Td>
        <For each={props.dataLabels}>
          {(dataLabel) => (
            <TdDataLabel
              widthClass={props.cellWidthClass}
              dataLabel={dataLabel}
              values={getValuesFromPoints(
                props.points.filter((point) => point.settings.isVisible),
                dataLabel,
              )}
            />
          )}
        </For>
        <Td />
        <Td />
      </THead>
      <tbody>
        <SortableList
          orientation="vertical"
          list={props.points}
          disabled={!props.sortable}
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
                number += 1
              }
            })

            store.selectedReport.line.update()
          }}
          component={(ref, point) => {
            const color = createMemo(() => {
              if (!props.colored) return undefined

              return point.settings.isVisible && point.icon
                ? point.icon.color
                : gray
            })

            return (
              <Tr
                ref={ref}
                color={color()}
                class={[!point.settings.isVisible && 'text-opacity-50']}
              >
                <Td class="hidden lg:table-cell">
                  <Button
                    size={size}
                    disabled={!props.sortable}
                    icon={
                      !props.sortable ? IconTablerHandOff : IconTablerHandStop
                    }
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    class={props.sortable ? 'handle' : ''}
                  />
                </Td>
                <Show when={!props.hideZones}>
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
                          store.selectedReport?.zones.map(
                            (zone) => zone.name,
                          ) || []
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
                </Show>
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
                            props.index,
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
                      point.settings.isVisible
                        ? IconTablerEye
                        : IconTablerEyeOff
                    }
                    onClick={() => {
                      point.settings.isVisible = !point.settings.isVisible
                    }}
                  />
                </Td>
              </Tr>
            )
          }}
        />
      </tbody>
    </Table>
  )
}

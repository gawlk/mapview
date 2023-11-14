import { Button, Table, Td, TdDataLabel, THead, Tr } from '/src/components'
import { useAppState } from '/src/index'
import { colors } from '/src/scripts'
import { store } from '/src/store'

export const TableZones = () => {
  const size = 'sm'

  const { t } = useAppState()

  const getValuesFromZones = (dataLabel: DataLabel<string>) =>
    (store.selectedReport()?.zones() || [])
      .map((zone) => zone.dataset.get(dataLabel)?.rawValue())
      .filter((value) => typeof value === 'number') as number[]

  return (
    <Table>
      <THead>
        <Td class="w-full" wide dataSaveable={true}>
          {t('Name')}
        </Td>
        <For
          each={
            store.selectedReport()?.dataLabels.table.selected()?.dataLabels() ||
            []
          }
        >
          {(dataLabel) => (
            <TdDataLabel
              widthClass="w-1/4"
              dataLabel={dataLabel}
              values={getValuesFromZones(dataLabel)}
            />
          )}
        </For>
        <Td />
        <Td />
      </THead>
      <tbody>
        <For each={store.selectedReport()?.zones() || []}>
          {(zone) => (
            <Tr
              color={colors[zone.settings.color()]}
              class={[!zone.settings.isVisible() && 'text-opacity-50']}
            >
              <Td wide>{zone.name()}</Td>
              <For
                each={
                  store
                    .selectedReport()
                    ?.dataLabels.table.list()[2]
                    .dataLabels() || []
                }
              >
                {(dataLabel) => (
                  <Td wide text="right">
                    {zone.dataset.get(dataLabel)?.value.displayedString()}
                  </Td>
                )}
              </For>
              <Td>
                <Button
                  size={size}
                  icon={IconTablerZoomIn}
                  onClick={() => {
                    const map = store.map()
                    map && zone.fitOnMap(map)
                  }}
                />
              </Td>
              <Td>
                <Button
                  size={size}
                  icon={
                    zone.settings.isVisible() ? IconTablerEye : IconTablerEyeOff
                  }
                  onClick={() => {
                    zone.settings.isVisible.set((b) => !b)
                  }}
                />
              </Td>
            </Tr>
          )}
        </For>
      </tbody>
    </Table>
  )
}

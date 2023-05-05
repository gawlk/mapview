import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { colors } from '/src/scripts'

import { THead, Table, Td, Tr } from './table'

import { Button } from '/src/components'

import TdDataLabel from './table/tdDataLabel'

export default () => {
  const size = 'sm'

  const [t] = useI18n()

  const getValuesFromZones = (dataLabel: DataLabel<string>) =>
    (store.selectedReport?.zones || [])
      .map((zone) =>
        zone.data.find((data) => data.label === dataLabel)?.getRawValue()
      )
      .filter((value) => typeof value === 'number') as number[]

  return (
    <Table>
      <THead>
        <Td class="w-full" wide>
          {t('Name')}
        </Td>
        <For
          each={
            store.selectedReport?.dataLabels.table.selected?.dataLabels || []
          }
        >
          {(dataLabel) => (
            <TdDataLabel
              dataLabel={dataLabel}
              values={getValuesFromZones(dataLabel)}
            />
          )}
        </For>
        <Td />
        <Td />
      </THead>
      <tbody>
        <For each={store.selectedReport?.zones || []}>
          {(zone) => (
            <Tr
              color={colors[zone.settings.color]}
              class={[!zone.settings.isVisible && 'text-opacity-50']}
            >
              <Td wide>{zone.name}</Td>
              <For
                each={
                  store.selectedReport?.dataLabels.table.list[2].dataLabels ||
                  []
                }
              >
                {(dataLabel) => (
                  <Td wide text="right">
                    {
                      zone.data.find((data) => data.label === dataLabel)?.value
                        .displayedString
                    }
                  </Td>
                )}
              </For>
              <Td>
                <Button
                  size={size}
                  icon={IconTablerZoomIn}
                  onClick={() => store.map && zone.fitOnMap(store.map)}
                />
              </Td>
              <Td>
                <Button
                  size={size}
                  icon={
                    zone.settings.isVisible ? IconTablerEye : IconTablerEyeOff
                  }
                  onClick={() =>
                    (zone.settings.isVisible = !zone.settings.isVisible)
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

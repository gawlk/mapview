// @ts-ignore
import { Sortable } from '@shopify/draggable'
import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { groupDataLabelsByCategory, moveIndexInCopiedArray } from '/src/scripts'

import { Button, DialogDivider, DialogOptions, Label } from '/src/components'
import SpanDataLabel from '/src/components/global/spanDataLabel'

export default () => {
  const [t] = useI18n()

  const tableDataLabels = createMemo(
    () => store.selectedReport?.dataLabels.table.selected
  )

  const tableSelectedDataLabels = createMemo(
    () => tableDataLabels()?.dataLabels
  )

  const tableDataLabelsChoices = createMemo(
    () => tableDataLabels()?.group.choices.list
  )

  const groupedTableDataLabelsChoices = createMemo(() =>
    groupDataLabelsByCategory(tableDataLabelsChoices() || [])
  )

  let sortable: Sortable | undefined
  let selectedDataLabels: HTMLDivElement | undefined

  onMount(() => {
    sortable = new Sortable(selectedDataLabels, {
      draggable: '.sortable',
      handle: '.handle',
      mirror: {
        constrainDimensions: true,
      },
    }).on('sortable:stop', (event: any) => {
      const { oldIndex, newIndex } = event.data

      const tableSelected = tableDataLabels()

      if (tableSelected?.dataLabels) {
        tableSelected.dataLabels = moveIndexInCopiedArray(
          tableSelected.dataLabels,
          oldIndex,
          newIndex
        )
      }
    })
  })

  onCleanup(() => {
    sortable?.destroy()
  })

  console.log('wekofpwekfopwkfopwkfopwekfpwok')

  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label label={t('Selected columns')}>
          <div class="space-y-2" ref={selectedDataLabels}>
            <For each={tableSelectedDataLabels()}>
              {(dataLabel, index) => (
                <div class="sortable flex">
                  <Button
                    full
                    leftIcon={IconTablerHandStop}
                    class="handle rounded-r-none"
                    label={String(index() + 1)}
                  >
                    <SpanDataLabel dataLabel={dataLabel} includeCategory />
                  </Button>
                  <Button
                    icon={IconTablerMinus}
                    color="red"
                    class="rounded-l-none border-l-black/10"
                    onClick={() => {
                      const index = tableSelectedDataLabels()?.findIndex(
                        (dataLabel2) => dataLabel === dataLabel2
                      )

                      if (typeof index === 'number' && index !== -1) {
                        tableSelectedDataLabels()?.splice(index, 1)
                      }
                    }}
                  />
                </div>
              )}
            </For>
          </div>
        </Label>
      </div>

      <DialogDivider class="-mx-4 mt-3" />

      <DialogOptions
        onClick={(value) => {
          const dataLabel = tableDataLabelsChoices()?.find(
            (dataLabel) => dataLabel.toString() === value
          )

          if (dataLabel && !tableSelectedDataLabels()?.includes(dataLabel)) {
            tableSelectedDataLabels()?.push(dataLabel)
          }
        }}
        options={{
          selected: null,
          list:
            groupedTableDataLabelsChoices().map(([category, dataLabels]) => {
              console.log('groupedTableDataLabelsChoices map')

              return {
                name: t(category.name),
                list: dataLabels.map((dataLabel) => {
                  const selected = createMemo(() =>
                    tableSelectedDataLabels()?.includes(dataLabel)
                  )

                  return {
                    value: dataLabel.toString(),
                    text: () => <SpanDataLabel dataLabel={dataLabel} />,
                    // TODO: Check why it disappeared
                    rightIcon: selected() ? IconTablerMinus : IconTablerPlus,
                    hidden: !!selected(),
                  }
                }),
              }
            }) || [],
        }}
      />
    </div>
  )
}

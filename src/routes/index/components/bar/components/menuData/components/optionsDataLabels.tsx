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

      const tableSelected = store.selectedReport?.dataLabels.table.selected

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

  return (
    <div class="space-y-4">
      <div class="space-y-2">
        <Label label={t('Selected columns')}>
          <div class="space-y-2" ref={selectedDataLabels}>
            <For
              each={store.selectedReport?.dataLabels.table.selected?.dataLabels}
            >
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
                      const index = tableDataLabels()?.dataLabels.findIndex(
                        (dataLabel2) => dataLabel === dataLabel2
                      )

                      if (typeof index === 'number' && index !== -1) {
                        tableDataLabels()?.dataLabels.splice(index, 1)
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
          const dataLabel = tableDataLabels()?.group.choices.list.find(
            (dataLabel) => dataLabel.toString() === value
          )

          if (dataLabel) {
            tableDataLabels()?.dataLabels.push(dataLabel)
          }
        }}
        options={{
          selected: null,
          list:
            groupDataLabelsByCategory(
              tableDataLabels()?.group.choices.list.filter(
                (dataLabel) =>
                  !tableDataLabels()?.dataLabels.includes(dataLabel)
              ) || []
            ).map(([category, dataLabels]) => ({
              name: t(category.name),
              list: dataLabels.map((dataLabel) => ({
                value: dataLabel.toString(),
                text: () => <SpanDataLabel dataLabel={dataLabel} />,
                rightIcon: IconTablerPlus,
              })),
            })) || [],
        }}
      />
    </div>
  )
}

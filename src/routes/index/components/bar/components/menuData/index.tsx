import { store } from '/src/store'

import { DialogTableData } from './components/dialogTableData'
import { SelectGroupBy } from './components/selectGroupBy'
import { TablePoints } from './components/tablePoints'
import { Values } from './components/values'

export const MenuData = () => {
  return (
    <>
      <div class="space-y-1.5 p-2 pb-0">
        <SelectGroupBy />
        <Values />
        <DialogTableData />
      </div>

      <div>
        <Show when={store.selectedReport?.dataLabels.groups.selected}>
          {(group) => (
            <TablePoints
              points={store.selectedReport?.line.sortedPoints || []}
              colored
              sortable
              cellWidthClass="w-[30%]"
              from={group().from}
              index={
                group().from === 'Drop'
                  ? (group() as BaseDropDataLabelsGroup<BaseDropIndex>).indexes
                      .selected || undefined
                  : undefined
              }
              dataLabels={
                [group().choices.selected].filter((d) => d) as DataLabel[]
              }
            />
          )}
        </Show>
      </div>
    </>
  )
}

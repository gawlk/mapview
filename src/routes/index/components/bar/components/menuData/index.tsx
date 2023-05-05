import store from '/src/store'

import DialogTableData from './components/dialogTableData'
import SelectGroupBy from './components/selectGroupBy'
import TablePointsGroupedBy from './components/tablePointsGroupedBy'

export default () => {
  return (
    <>
      <SelectGroupBy />
      <DialogTableData />

      <div class="-mx-2 !-mb-2">
        <Show when={store.selectedReport?.dataLabels.groups.selected}>
          {(group) => (
            <TablePointsGroupedBy
              colored
              sortable
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

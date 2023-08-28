import { store } from '/src/store'

import { TablePoints } from './tablePoints'
import { ZonePreTable } from './zonePreTable'

interface Props {
  dataLabels: DataLabel[]
  cellWidthClass: string
  from?: DataLabelsFrom
  index?: BaseDropIndex
  colored?: boolean
  sortable?: boolean
  hideZones?: true
}

export const TablePointsGroupedBy = (props: Props) => {
  return (
    <Switch>
      <Match when={store.selectedReport?.settings.groupBy === 'Number'}>
        <TablePoints
          points={store.selectedReport?.line.sortedPoints || []}
          {...props}
        />
      </Match>
      <Match when={store.selectedReport?.settings.groupBy === 'Zone'}>
        <For each={store.selectedReport?.zones}>
          {(zone) => (
            <>
              <ZonePreTable zone={zone} />
              <TablePoints points={zone.points} {...props} />
            </>
          )}
        </For>
      </Match>
    </Switch>
  )
}

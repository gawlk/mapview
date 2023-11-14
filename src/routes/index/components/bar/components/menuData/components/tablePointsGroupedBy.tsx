import { store } from '/src/store'

import { TablePoints } from './tablePoints'
import { ZonePreTable } from './zonePreTable'

interface Props {
  readonly dataLabels: DataLabel[]
  readonly cellWidthClass: string
  readonly from?: DataLabelsFrom
  readonly index?: BaseDropIndex
  readonly colored?: boolean
  readonly hideZones?: true
}

export const TablePointsGroupedBy = (props: Props) => {
  return (
    <Switch>
      <Match when={store.selectedReport()?.settings.groupBy() === 'Number'}>
        <TablePoints
          points={store.selectedReport()?.sortedPoints() || []}
          sortable
          {...props}
        />
      </Match>
      <Match when={store.selectedReport()?.settings.groupBy() === 'Zone'}>
        <For each={store.selectedReport()?.zones()}>
          {(zone) => (
            <>
              <ZonePreTable zone={zone} />
              <TablePoints points={zone.points()} {...props} />
            </>
          )}
        </For>
      </Match>
    </Switch>
  )
}

import {
  Dialog,
  DialogDivider,
  InputRadioHorizontal,
  SpanDataLabel,
} from '/src/components'
import { useAppState } from '/src/index'
import { createASS, run } from '/src/scripts'
import { store } from '/src/store'

import { SelectGroupBy } from '../selectGroupBy'
import { TablePointsGroupedBy } from '../tablePointsGroupedBy'
import { ButtonExport } from './components/buttonExport'
import { OptionsDataLabels } from './components/optionsDataLabels/index'
import { SelectIndex } from './components/selectIndex'
import { SelectSource } from './components/selectSource'
import { TableZones } from './components/tableZones'

export const DialogTableData = () => {
  const [state, setState] = createStore({
    zonesVisible: true,
  })

  const { t } = useAppState()

  const tables = createASS(undefined as HTMLDivElement | undefined)

  return (
    <Dialog
      moveable
      resizable
      maximizable
      closeable
      title={t('Table data')}
      button={{
        full: true,
        leftIcon: IconTablerArrowsMaximize,
        text: t('View all data'),
      }}
    >
      <div class="space-y-2 @3xl:flex @3xl:h-full @3xl:space-y-0">
        <div class="flex flex-none  flex-col space-y-2 overflow-y-auto @3xl:-my-3 @3xl:-ml-4 @3xl:w-[320px] @3xl:p-4">
          <SelectSource />
          <SelectIndex />
          <DialogDivider class="-mx-4 hidden @3xl:block" />
          <InputRadioHorizontal
            class={'hidden @3xl:inline-flex'}
            label="Zones"
            full
            values={{
              selected: state.zonesVisible ? 0 : 1,
              list: [
                { text: t('Visible'), value: '0' },
                { text: t('Hidden'), value: '1' },
              ],
            }}
            onChange={(value) => setState('zonesVisible', !Number(value))}
          />
          <Show
            when={
              store.selectedReport()?.dataLabels.table.selected()?.group
                .from !== 'Zone'
            }
          >
            <DialogDivider class="-mx-4 hidden @3xl:block" />
            <SelectGroupBy />
          </Show>
          <DialogDivider class="-mx-4 hidden @3xl:block" />
          <div class="block @3xl:hidden">
            <Dialog
              closeable
              button={{
                leftIcon: IconTablerColumns3,
                full: true,
                label: t('Columns'),
                text: () => (
                  <div class="space-x-2">
                    {run(
                      () =>
                        store
                          .selectedReport()
                          ?.dataLabels.table.selected()
                          ?.dataLabels()
                          .map((dataLabel) => (
                            <SpanDataLabel dataLabel={dataLabel} />
                          )),
                    )}
                  </div>
                ),
              }}
              title={t('Columns')}
            >
              <OptionsDataLabels />
            </Dialog>
          </div>
          <ButtonExport tables={tables} />
          <DialogDivider class="-mx-4 hidden @3xl:block" />
          <div class="hidden @3xl:block">
            <OptionsDataLabels />
          </div>
        </div>
        <Show when={store.selectedReport()?.dataLabels.table.selected()}>
          {(group) => (
            <div
              class="-mx-4 !-mb-3 overflow-x-auto overflow-y-visible @3xl:!-mr-4 @3xl:!-mt-3 @3xl:ml-0 @3xl:w-full @3xl:overflow-y-auto @3xl:border-l-2 @3xl:border-black/5"
              ref={tables.set}
            >
              <Show
                when={group().group.from !== 'Zone'}
                fallback={<TableZones />}
              >
                <TablePointsGroupedBy
                  cellWidthClass="w-1/6"
                  from={group().group.from}
                  dataLabels={group().dataLabels()}
                  index={group().index?.()}
                  hideZones={!state.zonesVisible || undefined}
                />
              </Show>
            </div>
          )}
        </Show>
      </div>
    </Dialog>
  )
}

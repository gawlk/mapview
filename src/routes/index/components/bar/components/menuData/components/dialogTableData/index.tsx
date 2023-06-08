import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Dialog, DialogDivider } from '/src/components'
import SpanDataLabel from '/src/components/global/spanDataLabel'

import OptionsDataLabels from './components/optionsDataLabels'
import SelectIndex from './components/selectIndex'
import SelectSource from './components/selectSource'
import TableZones from './components/tableZones'

import SelectGroupBy from '../selectGroupBy'
import TablePointsGroupedBy from '../tablePointsGroupedBy'

export default () => {
  const [t] = useI18n()

  return (
    <Dialog
      moveable
      resizable
      maximizable
      closeable
      title="Table data"
      button={{
        full: true,
        leftIcon: IconTablerArrowsMaximize,
        text: t('View all data'),
      }}
    >
      <div class="h-full @container">
        <div class="h-full space-y-2 @3xl:flex  @3xl:space-y-0">
          {/* TODO: Fix - margin, not great */}
          <div class="flex-none space-y-2  overflow-y-auto @3xl:-my-3 @3xl:-ml-4 @3xl:w-[320px] @3xl:p-4">
            <SelectSource />
            <SelectIndex />
            <Show
              when={
                store.selectedReport?.dataLabels.table.selected?.group.from !==
                'Zone'
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
                      {(() =>
                        store.selectedReport?.dataLabels.table.selected?.dataLabels.map(
                          (dataLabel) => <SpanDataLabel dataLabel={dataLabel} />
                        ))()}
                    </div>
                  ),
                }}
                title={t('Columns')}
              >
                <OptionsDataLabels />
              </Dialog>
            </div>
            <div class="hidden @3xl:block">
              <OptionsDataLabels />
            </div>
          </div>
          <Show when={store.selectedReport?.dataLabels.table.selected}>
            {(group) => (
              <div class="-mx-4 !-mb-4 @3xl:!-mr-4 @3xl:!-mt-3 @3xl:ml-0 @3xl:w-full @3xl:overflow-auto @3xl:border-l-2 @3xl:border-black/5">
                <Show
                  when={group().group.from !== 'Zone'}
                  fallback={<TableZones />}
                >
                  <TablePointsGroupedBy
                    sortable
                    from={group().group.from}
                    dataLabels={group().dataLabels}
                    index={group().index}
                  />
                </Show>
              </div>
            )}
          </Show>
        </div>
      </div>
    </Dialog>
  )
}

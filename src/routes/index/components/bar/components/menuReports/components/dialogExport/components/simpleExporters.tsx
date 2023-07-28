import store from '/src/store'

import {
  downloadFile,
  getSimpleReportExports,
  mvrzExporter,
} from '/src/scripts'

import { Button } from '/src/components'

export default (props: NavigatorComponentProps) => {
  const simpleExports = createMemo(() => [
    ...(store.selectedReport
      ? getSimpleReportExports(
          store.selectedReport as unknown as MachineProject
        )
      : []),
  ])

  return (
    <div class="space-y-2">
      <Button
        leftIcon={IconTablerFileSpreadsheet}
        rightIcon={IconTablerChevronRight}
        full
        onClick={() => props.next('/mvrz')}
      >
        <span class="flex-1 text-left">{mvrzExporter.name}</span>
      </Button>
      <For each={simpleExports()}>
        {(exporter) => (
          <Button
            full
            leftIcon={IconTablerFileText}
            rightIcon={IconTablerDownload}
            onClick={async () => {
              // TODO: Fix any
              store.selectedProject &&
                downloadFile(
                  await exporter.export(store.selectedProject as any)
                )
            }}
          >
            <span class="flex-1 text-left">{exporter.name}</span>
          </Button>
        )}
      </For>
    </div>
  )
}

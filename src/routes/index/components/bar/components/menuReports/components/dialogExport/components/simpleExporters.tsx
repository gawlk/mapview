import { Button } from '/src/components'
import {
  downloadFile,
  getSimpleReportExports,
  mvrzExporter,
  run,
} from '/src/scripts'
import { store } from '/src/store'

export const SimpleExporters = (props: NavigatorComponentProps) => {
  const simpleExports = createMemo(() => [
    ...(store.selectedReport
      ? getSimpleReportExports(
          store.selectedReport as unknown as MachineProject,
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
            onClick={() => {
              void run(async () => {
                store.selectedProject &&
                  downloadFile(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await exporter.export(store.selectedProject as any),
                  )
              })
            }}
          >
            <span class="flex-1 text-left">{exporter.name}</span>
          </Button>
        )}
      </For>
    </div>
  )
}

import { Button } from '/src/components'
import {
  downloadFile,
  getSimpleReportExports,
  mvrzExporter,
  run,
} from '/src/scripts'
import { store } from '/src/store'

export const SimpleExporters = (props: NavigatorComponentProps) => {
  const simpleExports = createMemo(() => {
    const selectedProject = store.selectedProject()
    return selectedProject ? getSimpleReportExports(selectedProject) : []
  })

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
                const selectedProject = store.selectedProject()
                selectedProject &&
                  // @ts-expect-error Types failing
                  downloadFile(await exporter.export(selectedProject))
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

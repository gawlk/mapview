import { ButtonFile } from '/src/components'
import { convertFileToDataURL } from '/src/scripts'
import { store } from '/src/store'

import { ButtonFlyToReport } from './components/buttonFlyToReport'
import { DialogAlbum } from './components/dialogAlbum'
import { DialogExport } from './components/dialogExport'
import { DialogReportInformation } from './components/dialogInformation'
import { DialogReports } from './components/dialogReports'
import { DialogScreenshot } from './components/dialogScreenshot'
import { SelectReportMarkerIcon } from './components/selectReportMarkerIcon'

export const MenuReports = () => {
  return (
    <>
      <Show when={store.selectedReport()}>
        {(report) => (
          <div class="flex space-x-2">
            <SelectReportMarkerIcon iconName={report().settings.iconName} />
            <DialogReports />
            <ButtonFlyToReport report={report()} />
          </div>
        )}
      </Show>
      <div class="flex space-x-2">
        <Show when={store.selectedReport()?.screenshots().length}>
          <DialogAlbum />
        </Show>
        <DialogScreenshot />
        <ButtonFile
          onFiles={(files) =>
            Array.from(files || []).forEach(async (file: File) => {
              const dataURL = await convertFileToDataURL(file)
              store.selectedReport()?.screenshots.set((l) => {
                l.push(dataURL)
                return l
              })
            })
          }
        />
      </div>
      <DialogReportInformation />
      <DialogExport />
    </>
  )
}

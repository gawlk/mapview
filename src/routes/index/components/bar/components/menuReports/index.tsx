import store from '/src/store'

import { convertFileToDataURL } from '/src/scripts'

import { ButtonFile } from '/src/components'

import ButtonFlyToReport from './components/buttonFlyToReport'
import DialogAlbum from './components/dialogAlbum'
import DialogExport from './components/dialogExport'
import DialogInformations from './components/dialogInformations'
import DialogReports from './components/dialogReports'
import DialogScreenshot from './components/dialogScreenshot'
import DialogZoneSettings from './components/dialogZoneSettings'
import SelectReportMarkerIcon from './components/selectReportMarkerIcon'

export default () => {
  return (
    <>
      <Show when={store.selectedReport}>
        {(report) => (
          <div class="flex space-x-2">
            <SelectReportMarkerIcon report={report()} />
            <DialogReports />
            <ButtonFlyToReport report={report()} />
          </div>
        )}
      </Show>
      <div class="flex space-x-2">
        <Show when={store.selectedReport?.screenshots.length}>
          <DialogAlbum />
        </Show>
        <DialogScreenshot />
        <ButtonFile
          onFiles={(files) =>
            Array.from(files || []).forEach(async (file: File) =>
              store.selectedReport?.screenshots.push(
                await convertFileToDataURL(file)
              )
            )
          }
        />
      </div>
      <DialogInformations />
      <DialogZoneSettings />
      <DialogExport />
    </>
  )
}
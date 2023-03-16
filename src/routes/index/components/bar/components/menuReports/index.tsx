import store from '/src/store'

import { convertFileToDataURL } from '/src/scripts'

import { ButtonFile } from '/src/components'

import ButtonReportVisibility from './components/buttonReportVisibility'
import DialogAlbum from './components/dialogAlbum'
import DialogReports from './components/dialogReports'
import DialogScreenshot from './components/dialogScreenshot'
import SelectReportMarkerIcon from './components/selectReportMarkerIcon'

export default () => {
  return (
    <>
      <Show when={store.selectedReport} keyed>
        {(report) => (
          <div class="flex space-x-2">
            <SelectReportMarkerIcon report={report} />
            <DialogReports />
            <ButtonReportVisibility report={report} />
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
        {/* <SelectReportMarkerIcon report={store.selectedReport as BaseReport} />
      <DialogReports />
      <ButtonReportVisibility report={store.selectedReport as BaseReport} /> */}
      </div>
    </>
  )
}

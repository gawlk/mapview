import { zipSync } from 'fflate'

import { convertData64ImageToUint8Array } from '/src/scripts'

export const save = async (project: MachineProject) => {
  const json = project.toJSON()

  console.log('json', json)

  const images: { [key: string]: Uint8Array } = {}
  const screenshots: { [key: string]: Uint8Array } = {}
  const Rawdata: { [key: string]: Uint8Array } = {}

  await Promise.all([
    ...project.images.map(async (image) => {
      if (image.sourceData.url) {
        images[image.toJSON().name] = await convertData64ImageToUint8Array(
          image.sourceData.url
        )
      }
    }),
    ...project.reports.list
      .map((report, reportIndex) =>
        report.screenshots.map((screenshot) => {
          return {
            reportIndex,
            screenshot,
          }
        })
      )
      .flat()
      .map(async (obj, index) => {
        screenshots[`${index}.png`] = await convertData64ImageToUint8Array(
          obj.screenshot
        )

        json.base.reports.list[obj.reportIndex].base.screenshots.push(index)
      }),
    ...project.reports.list
      .map((report) => report.line.sortedPoints)
      .flat()
      .map((point) => {
        if (point.rawDataFile) {
          Rawdata[point.id] = new Uint8Array(point.rawDataFile)
        }
      }),
  ])

  const zipped = zipSync({
    'database.json': new Uint8Array(
      await new Blob([JSON.stringify(json, null, 2)], {
        type: 'json',
      }).arrayBuffer()
    ),
    images,
    screenshots,
    Rawdata,
  })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([zipped]))
  a.download = `${String(project.name.value).replaceAll(' ', '_')}.mpvz`
  a.click()
}

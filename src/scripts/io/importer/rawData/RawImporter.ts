import { ExtendedBinaryReader } from './ExtendedBinaryStream'
import ImpactDataFile from './ImpactDataFile'

function saveRawData(file: ArrayBufferLike, points: BasePoint[], id: string) {
  const point = points.find((p) => p.id === id)

  if (point) {
    point.rawDataFile = file

    try {
      const reader = new ExtendedBinaryReader(file)

      const impactDataFile = new ImpactDataFile()

      impactDataFile.loadFromFile(reader)

      for (const index in point.drops) {
        point.drops[index].impactData = impactDataFile.ImpactDatas[index]
      }
    } catch (_) {
      console.error(`Failed parsing point's ${id} rawdata file`)
    }
  }
}

export function importRawDataFromZIP(
  zip: Fflate.Unzipped,
  project: MachineProject
) {
  const folderName = 'rawdata'

  const points = project.reports.list.flatMap((a) => a.line.sortedPoints)

  Object.keys(zip)
    .filter((key) => key.toLowerCase().startsWith(folderName))
    .forEach((fileName) => {
      const file = zip[fileName]

      if (file.length > 0) {
        saveRawData(
          file.buffer,
          points,
          fileName.substring(folderName.length + 1)
        )
      }
    })
}

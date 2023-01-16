import { ExtendedBinaryReader } from './ExtendedBinaryStream'
import ImpactDataFile from './ImpactDataFile'

function saveRawData(file: ArrayBufferLike, points: BasePoint[], id: string) {
  const reader = new ExtendedBinaryReader(file)
  const impactDataFile = new ImpactDataFile()
  const point = points.find((p) => p.id === id)

  impactDataFile.loadFromFile(reader)

  if (point) {
    point.rawDataFile = file

    for (const index in point.drops) {
      point.drops[index].impactData = impactDataFile.ImpactDatas[index]
    }
  }
}

export function importRawDataFromZIP(
  zip: Fflate.Unzipped,
  project: MachineProject
) {
  const folderName = 'rawdata'
  const points = project.reports.list.flatMap((a) => a.line.sortedPoints)
  const rawData = Object.keys(zip).filter((key) => key.startsWith(folderName))

  for (const filename of rawData) {
    const file = zip[filename]

    if (file.length > 0) {
      saveRawData(
        file.buffer,
        points,
        filename.substring(folderName.length + 1)
      )
    }
  }
}

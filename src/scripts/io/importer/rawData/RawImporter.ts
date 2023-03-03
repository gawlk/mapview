import { ExtendedBinaryReader } from './ExtendedBinaryStream'
import ImpactDataFile from './ImpactDataFile'

const removeLeading0s = (str: string) => str.replace(/^0+/, '')

const saveRawData = (
  file: ArrayBufferLike,
  points: BasePoint[],
  id: string
) => {
  const point = points.find(
    (p) => removeLeading0s(p.id) === removeLeading0s(id)
  )

  if (point) {
    point.rawDataFile = file

    // parsePointRawData(file, point, id);
  }
}

export function parsePointRawData(
  file: ArrayBufferLike,
  point: BasePoint,
  id: string
) {
  try {
    const reader = new ExtendedBinaryReader(file)

    const impactDataFile = new ImpactDataFile()

    impactDataFile.loadFromFile(reader)

    point.drops.forEach((drop, index) => {
      drop.impactData = impactDataFile.ImpactDatas[index]
    })
  } catch (_) {
    console.error(`Failed parsing point's ${id} rawdata file`)
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

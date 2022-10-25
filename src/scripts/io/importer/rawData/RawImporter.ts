import { Unzipped } from 'fflate'
import { ExtendedBinaryReader } from './ExtendedBinaryStream'
import ImpactDataFile from './ImpactDataFile'

function saveRawData(
  file: ArrayBufferLike,
  points: MachinePoint[],
  id: string
) {
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

export function importRawData(zip: Unzipped, project: MachineProject) {
  const folderName = 'Rawdata'
  const points = project.reports.list.flatMap((a) => a.line.sortedPoints)
  const rawData = Object.keys(zip).filter((key) => key.startsWith(folderName))

  for (const filename of rawData) {
    const file = zip[filename]
    saveRawData(file.buffer, points, filename.substring(folderName.length + 1))
  }
  console.log(
    project.reports.list.flatMap((a) =>
      a.line.sortedPoints.map((p) => p.drops.map((d) => d.impactData))
    )
  )
}

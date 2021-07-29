interface Project {
  name: string
  reports: Report[]
  selectedReport: Report | undefined
  images: ImageMap[]
  units: MathUnit[]
  database:
    | {
        machine: string
        version: number
      }
    | undefined
  arePointsLinked: boolean
  arePointsLocked: boolean
  arePointsVisible: boolean
  areImagesVisible: boolean
  pointsState: PointsState
  informations: Field[]
  configurations: Field[]
}

type PointsState = 'value' | 'number' | 'nothing'

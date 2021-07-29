interface Report {
  name: string
  images: string[]
  points: Point[]
  line: Line
  dataSettings: DataSettings
  isVisible: boolean
}

interface DataSettings {
  keys: string[]
}

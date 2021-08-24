interface Report {
  name: string
  images: string[]
  points: Point[]
  line: Line
  dataSettings: DataSettings
  isVisible: boolean
  icon: string
}

interface DataSettings {
  keys: string[]
  selected: string
}

interface Report {
  name: string
  images: string[]
  points: Point[]
  line: Line | undefined
  dataSettings: DataSettings
}

interface DataSettings {
  keys: string[]
}

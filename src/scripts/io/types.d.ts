type JSONMapviewVAny = JSONMapview

interface JSONMapview {
  readonly version: 1
  readonly jsonFileFormat: 'Database from Mapview'
  readonly project: JSONMachineProject
}

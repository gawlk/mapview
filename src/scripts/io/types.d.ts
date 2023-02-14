type JSONMapviewVAny = JSONMapview

interface JSONMapview {
  readonly version: 1
  readonly jsonFileFormat: 'Project database from Mapview'
  readonly project: JSONMachineProject
}

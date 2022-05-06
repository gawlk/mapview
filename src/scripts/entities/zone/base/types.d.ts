interface BaseZone {
  readonly machine: MachineName
  name: string
  readonly points: MachinePoint[]
  readonly settings: JSONZoneSettings
  init: () => void
  clean: () => void
}

interface JSONZone {
  name: string
  points: JSONPoint[]
  readonly settings: JSONZoneSettings
}

interface JSONZoneSettings {
  color: ColorName
  isVisible: boolean
}

interface BaseZoneCreatorParameters extends MachineZoneCreatorParameters {
  machine: MachineName
}

// ---
// JSON
// ---

type JSONBaseZoneVAny = JSONBaseZone

interface JSONBaseZone {
  version: 1
  name: string
  points: JSONBasePoint[]
  readonly settings: JSONZoneSettings
}

interface JSONZoneSettings {
  color: ColorName
  isVisible: boolean
}

// ---
// Object
// ---

interface BaseZone {
  readonly machine: MachineName
  name: string
  readonly points: MachinePoint[]
  readonly settings: JSONZoneSettings
  report: MachineReport
  init: () => void
  clean: () => void
}

interface BaseZoneCreatorParameters extends MachineZoneCreatorParameters {
  machine: MachineName
}

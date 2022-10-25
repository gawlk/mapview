// ---
// JSON
// ---

type JSONBaseZoneVAny = JSONBaseZone

interface JSONBaseZone {
  readonly version: 1
  readonly name: string
  readonly points: JSONMachinePoint[]
  readonly settings: JSONZoneSettings
}

interface JSONZoneSettings {
  readonly version: 1
  color: ColorName
  isVisible: boolean
}

// ---
// Object
// ---

interface BaseZone {
  readonly machine: MachineName
  readonly points: MachinePoint[]
  readonly settings: JSONZoneSettings
  name: string
  report: MachineReport
  readonly init: () => void
  readonly clean: () => void
  readonly toBaseJSON: () => JSONBaseZone
}

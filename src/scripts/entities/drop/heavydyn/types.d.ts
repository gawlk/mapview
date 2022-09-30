// ---
// JSON
// ---

interface JSONHeavydynDropIndex extends BaseDropIndex {
  version: 1
  readonly type: HeavydynDropType
  value: number
  readonly unit: string
}

type HeavydynDropType = 'Distance' | 'Time' | 'Force' | 'Height'

// ---
// Object
// ---

interface HeavydynDrop extends BaseDrop {
  index: HeavydynDropIndex
  point: HeavydynPoint
}

interface HeavydynDropIndex extends BaseDropIndex {
  readonly machine: 'Heavydyn'
  readonly type: HeavydynDropType
  value: MathNumber
}

interface HeavydynDropCreatorParameters extends MachineDropCreatorParameters {
  point: HeavydynPoint
}

// ---
// JSON
// ---

interface JSONMaxidynDropIndex extends BaseDropIndex {
  version: 1
  type: MaxidynDropType
}

type MaxidynDropType = 'Training' | 'Averaging'

// ---
// Object
// ---

interface MaxidynDrop extends BaseDrop {
  index: MaxidynDropIndex
  point: MaxidynPoint
}

interface MaxidynDropIndex extends BaseDropIndex {
  machine: 'Maxidyn'
  type: MaxidynDropType
}

interface MaxidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MaxidynPoint
}

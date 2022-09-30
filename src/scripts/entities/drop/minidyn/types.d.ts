// ---
// JSON
// ---

interface JSONMinidynDropIndex extends BaseDropIndex {
  version: 1
  type: MinidynDropType
}

type MinidynDropType = 'Training' | 'Averaging'

// ---
// Object
// ---

interface MinidynDrop extends BaseDrop {
  index: MinidynDropIndex
  point: MinidynPoint
}

interface MinidynDropIndex extends BaseDropIndex {
  machine: 'Minidyn'
  type: MinidynDropType
}

interface MinidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MinidynPoint
}

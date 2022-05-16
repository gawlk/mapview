interface MaxidynDrop extends BaseDrop {
  index: MaxidynDropIndex
  point: MaxidynPoint
}

interface MaxidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MaxidynPoint
}

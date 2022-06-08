interface MinidynDrop extends BaseDrop {
  index: MinidynDropIndex
  point: MinidynPoint
}

interface MinidynDropCreatorParameters extends MachineDropCreatorParameters {
  point: MinidynPoint
}

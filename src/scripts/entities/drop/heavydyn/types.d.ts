interface HeavydynDrop extends BaseDrop {
  index: HeavydynDropIndex
  point: HeavydynPoint
}

interface HeavydynDropCreatorParameters extends MachineDropCreatorParameters {
  point: HeavydynPoint
}

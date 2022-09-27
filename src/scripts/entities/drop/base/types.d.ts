interface BaseDrop {
  index: MachineDropIndex
  data: DataValue[]
  additionnalFields: MachineField[]
  point: MachinePoint
  impactData: ImpactData | null
}

interface JSONDrop {
  index: number
  data: JSONDataValue[]
}

interface BaseDropCreatorParameters extends MachineDropCreatorParameters {
  machine: MachineName
}

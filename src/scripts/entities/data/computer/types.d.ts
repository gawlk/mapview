type DataCompute = (label: DataLabel) => void

interface DataComputer {
  readonly label: DataLabel
  readonly init: VoidFunction
  readonly clean: VoidFunction
}

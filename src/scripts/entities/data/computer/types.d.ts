type DataCompute = (label: DataLabel) => void

interface DataComputer {
  label: DataLabel
  init: () => void
  clean: () => void
}

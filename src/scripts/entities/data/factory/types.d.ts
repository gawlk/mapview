interface DataFactory {
  label?: DataLabel
  createDataValueTuple: () => DataValueTuple | []
}

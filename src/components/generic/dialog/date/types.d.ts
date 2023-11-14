type DialogDateProps = DialogDatePropsOnly & DialogClassicProps

interface DialogDatePropsOnly extends SaveableProps {
  readonly value: Date

  readonly max?: Date

  readonly min?: Date

  readonly reset?: {
    readonly default: Date
    readonly callback: VoidFunction
  }
}

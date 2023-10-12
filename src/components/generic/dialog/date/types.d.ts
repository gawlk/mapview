type DialogDateProps = DialogDatePropsOnly & DialogClassicProps

interface DialogDatePropsOnly extends SaveableProps {
  value: Date

  max?: Date

  min?: Date

  reset?: {
    default: Date
    callback: () => void
  }
}

type InputDataListProps = InputDataListPropsOnly &
  Omit<InputPropsWithHTMLAttributes, 'list'>

interface InputDataListPropsOnly {
  readonly list: string[]
  readonly dialog?: DialogPropsWithHTMLAttributes
}

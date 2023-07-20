type InputDataListProps = InputDataListPropsOnly &
  Omit<InputPropsWithHTMLAttributes, 'list'>

interface InputDataListPropsOnly {
  list: string[]
  dialog?: DialogPropsWithHTMLAttributes
}

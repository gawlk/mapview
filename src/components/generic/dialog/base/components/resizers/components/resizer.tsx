import { classPropToString } from '/src/components/generic/props'

interface Props {
  onMouseDown: () => void
  class: ClassProp
}
export default (props: Props) => {
  return (
    <div
      onMouseDown={() => props.onMouseDown()}
      // onDblClick={() => props.onDblClick({ height: undefined })}
      class={classPropToString(['absolute md:block'])}
    />
  )
}

import { classPropToString } from '/src/components'

interface Props {
  class?: ClassProp
}

export default (props: Props) => {
  return (
    <hr
      class={classPropToString([
        'my-4 flex-none border-t-2 border-black/5',

        props.class,
      ])}
    />
  )
}

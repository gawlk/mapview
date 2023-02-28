import { classPropToString } from '/src/components'

interface Props {
  class?: ClassProp
}

export default (props: Props) => {
  return (
    <hr
      class={classPropToString([
        '-mx-6 my-4 flex-none border-t-2 border-neutral-100',

        props.class,
      ])}
    />
  )
}

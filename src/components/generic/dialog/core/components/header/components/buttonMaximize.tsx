import { Button } from '/src/components'

interface Props {
  readonly show: boolean
  readonly maximized: boolean
  readonly onClick: ButtonPropsWithHTMLAttributes['onClick']
}

export const DialogButtonMaximize = (props: Props) => {
  return (
    <Show when={props.show}>
      <Button
        color="green"
        size="xs"
        icon={
          props.maximized ? IconTablerArrowsMinimize : IconTablerArrowsMaximize
        }
        onMouseDown={(event) => event.stopPropagation()}
        onClick={props.onClick}
        class="ml-4 hidden md:inline-flex"
      />
    </Show>
  )
}

import { Button } from '/src/components'

interface Props {
  show: boolean
  maximized: boolean
  onClick: ButtonPropsWithHTMLAttributes['onClick']
}

export default (props: Props) => {
  return (
    // TODO: Add callback with span in order to have a centered title (but hidden below md:)
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

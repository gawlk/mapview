import { Button, Container } from '/src/components'

interface Props extends Solid.ParentProps {
  text: string
  defaultOpen: boolean
  icon?: IconProp
  onClick: (open: boolean) => void
}

export default (props: Props) => {
  // TODO: Improve component

  const defaultOpen = props.defaultOpen
  let details: HTMLDetailsElement | undefined

  return (
    <details
      ref={details}
      open={defaultOpen}
      onToggle={() => props.onClick(details?.open || false)}
    >
      <summary>
        <Button full leftIcon={props.icon} rightIcon={IconTablerChevronDown}>
          <span class="flex-1 text-left">{props.text}</span>
        </Button>
      </summary>
      <Container class="space-y-2 border-t-0">{props.children}</Container>
    </details>
  )
}

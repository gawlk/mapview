import { Button, Container } from '/src/components'

interface DetailsButtonProps extends InternalButtonProps {
  rightIconOpen?: IconProp
  rightIconClosed?: IconProp
}

interface Props
  extends Solid.ParentProps,
    Omit<Solid.JSX.DetailsHTMLAttributes, 'onClick'> {
  button?: DetailsButtonProps
  defaultOpen?: boolean
  locked?: boolean
  onClick?: (open: boolean) => void
}

// TODO: Remove DialogButton and move text to button, rename to content

// TODO: Add button props here and apply them to the opening button

export default (props: Props) => {
  // TODO: Improve component

  const defaultOpen = props.defaultOpen || false
  let details: HTMLDetailsElement | undefined

  const [state, setState] = createStore({
    open: defaultOpen,
  })

  const buttonRightIcon = createMemo(() =>
    state.open
      ? props.button?.rightIconOpen ?? IconTablerChevronDown
      : props.button?.rightIconClosed ?? IconTablerChevronRight
  )

  return (
    <details
      ref={details}
      open={state.open}
      onToggle={() => props.onClick?.(details?.open || false)}
    >
      <summary>
        <Button
          full
          {...props.button}
          rightIcon={!props.locked ? buttonRightIcon() : undefined}
          onClick={() => !props.locked && setState('open', (open) => !open)}
          class={[state.open && 'rounded-b-none']}
        >
          <span class="flex-1 text-left">
            {typeof props.button?.text === 'function'
              ? props.button.text()
              : props.button?.text ?? props.title}
          </span>
        </Button>
      </summary>
      <Container
        class={[
          state.open && 'rounded-t-none',
          'space-y-2 overflow-hidden border-t-0',
        ]}
      >
        {props.children}
      </Container>
    </details>
  )
}

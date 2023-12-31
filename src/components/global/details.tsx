import { Button, Container } from '/src/components'

interface DetailsButtonProps extends InternalButtonProps {
  rightIconOpen?: IconProp
  rightIconClosed?: IconProp
}

interface Props extends ParentProps, Omit<DetailsHTMLAttributes, 'onClick'> {
  button?: DetailsButtonProps
  defaultOpen?: boolean
  locked?: boolean
  onClick?: (open: boolean) => void
}

export const Details = (props: Props) => {
  const defaultOpen = props.defaultOpen || false
  let details: HTMLDetailsElement | undefined

  const [state, setState] = createStore({
    open: defaultOpen,
  })

  const buttonRightIcon = createMemo(() =>
    state.open
      ? props.button?.rightIconOpen ?? IconTablerChevronDown
      : props.button?.rightIconClosed ?? IconTablerChevronRight,
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
          kind={props.locked ? 'static' : 'clickable'}
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
        borderColor="base"
        class={[
          state.open && 'rounded-t-none',
          'space-y-2 overflow-hidden border-t-0',
          props.class,
        ]}
      >
        {props.children}
      </Container>
    </details>
  )
}

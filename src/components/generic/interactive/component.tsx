import {
  classPropToString,
  Container,
  IconInteractive,
  interactiveBooleanPropsKeysObject,
  removeProps,
} from '/src/components'
import { run } from '/src/scripts'

interface Props extends MergePropsWithHTMLProps<InteractiveProps> {}

export const Interactive = (props: Props) => {
  const containerProps = removeProps(props, interactiveBooleanPropsKeysObject)

  const iconProps = removeProps(containerProps, {
    onClick: true,
    onclick: true,
    class: true,
    style: true,
    ref: true,
    id: true,
  })

  const disabled = createMemo(() => props.disabled || props.kind === 'static')

  return (
    <Container
      {...containerProps}
      bgHoverColor={props.kind !== 'static' ? props.bgHoverColor : null}
      orientation={props.orientation || props.icon ? undefined : 'horizontal'}
      disabled={disabled()}
      fontSize={props.fontSize || props.size || 'sm'}
      class={[
        // Width
        props.full && 'w-full min-w-0',

        // Center
        props.center && 'justify-center',

        // Hover & Active
        !disabled() &&
          run(() => {
            switch (props.color) {
              case 'secondary':
                return 'hover:bg-opacity-10 active:bg-opacity-[0.15]'
              case 'base':
              case 'transparent':
                return [
                  props.color === 'transparent' && 'hover:bg-black/5',
                  'hover:brightness-[0.95] active:brightness-90',
                ]
            }
          }),

        // State
        run(() => {
          if (props.disabled) {
            return 'opacity-60'
          }

          if (props.kind !== 'static') {
            return `group appearance-none transition duration-200 will-change-transform focus:outline-none disabled:transform-none motion-reduce:transform-none ${
              props.kind === 'clickable' ? 'cursor-pointer select-none' : ''
            }`
          }
        }),

        // Because 'inline-flex' has priority over hidden attribute
        !props.hidden && 'inline-flex items-center',

        'font-medium',

        props.class,
      ]}
    >
      <Show
        when={!props.icon}
        fallback={
          <>
            <IconInteractive
              {...iconProps}
              icon={props.icon}
              class={props.iconClass}
              style={props.iconStyle}
            />
            {props.children}
          </>
        }
      >
        <Show when={props.leftIcon}>
          <IconInteractive
            {...iconProps}
            side="left"
            icon={props.leftIcon}
            class={props.leftIconClass}
            style={props.leftIconStyle}
          />
        </Show>

        <Show when={props.label}>
          <label
            for={props.id}
            class={classPropToString([
              'pointer-events-none flex-none select-none whitespace-pre text-black/50',
            ])}
          >
            {`${props.label}: `}
          </label>
        </Show>

        {props.children}

        <Show when={props.suffix}>
          <span class="text-black/50">{props.suffix}</span>
        </Show>

        <Show when={props.rightIcon || (props.center && props.leftIcon)}>
          <IconInteractive
            {...iconProps}
            side="right"
            icon={props.rightIcon}
            class={props.rightIconClass}
            style={props.rightIconStyle}
          />
        </Show>
      </Show>
    </Container>
  )
}

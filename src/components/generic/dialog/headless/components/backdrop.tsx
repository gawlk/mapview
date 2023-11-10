import { createASS } from '/src/scripts'

interface Props {
  readonly show: Accessor<boolean | undefined>
  readonly open: Accessor<boolean>
  readonly zIndex: Accessor<number>
  // readonly style: StyleProp
  // readonly class: ClassProp
}

export const DialogBackdrop = (props: Props) => {
  const state = {
    zIndex: createASS(0),
  }

  // Save the zIndex when opening the dialog as a modal in order to not bring the backdrop in front of sub-dialogs which results in the backdrop being always behind the main dialog and all its child-dialogs
  createEffect(() => props.show() && state.zIndex.set(props.zIndex))

  return (
    <Show when={props.show()}>
      <div
        onMouseDown={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
        style={{
          'z-index': state.zIndex(),
          position: 'fixed',
          inset: '0px',
          opacity: props.open() ? 1 : 0,
          'background-color': 'rgb(0 0 0 / 0.25)',
          filter: 'blur(4px)',
          'transition-property': 'opacity',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        }}
      />
    </Show>
  )
}

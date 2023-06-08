import { classPropToString } from '/src/components'

interface Props {
  show: boolean
  open: boolean
  zIndex: number
}

export default (props: Props) => {
  const [state, setState] = createStore({
    zIndex: 0,
  })

  // Save the zIndex when opening the dialog as a modal in order to not bring the backdrop in front of sub-dialogs which results in the backdrop being always behind the main dialog and all its child-dialogs
  createEffect(
    on(
      () => props.show,
      (show) => show && setState('zIndex', props.zIndex)
    )
  )

  return (
    <Show when={props.show}>
      <div
        onMouseDown={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
        class={classPropToString([
          props.open ? 'opacity-100' : 'opacity-0',
          'fixed inset-0 bg-black/25 blur-sm transition-opacity',
        ])}
        style={{
          'z-index': state.zIndex,
        }}
      />
    </Show>
  )
}

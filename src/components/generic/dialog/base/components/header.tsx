import { classPropToString } from '/src/components'

import { DialogButtonClose, DialogButtonMaximize } from '.'

interface Props {
  resetTransform: () => void
  toggleMaximize: () => void
  setMovingState: () => void
  close: (element?: HTMLElement) => void
  maximized: boolean
  title?: string
  maximizable?: boolean
  moveable?: boolean
  closeable?: boolean
}

export default (props: Props) => {
  return (
    <div
      onDblClick={props.resetTransform}
      onMouseDown={() => {
        if (!props.maximized && props.moveable) {
          props.setMovingState()
        }
      }}
      class={classPropToString([
        !props.maximized && props.moveable && 'md:cursor-move',
        'flex items-center px-4 pb-3 pt-4',
      ])}
    >
      <Show when={props.closeable}>
        <DialogButtonClose close={props.close} />
      </Show>

      <h2 class="flex-grow truncate text-center text-xl font-semibold">
        {props.title}
      </h2>

      <span
        class="min-w-0 flex-1 md:hidden"
        style={{
          'max-width': '2.75rem',
        }}
      />

      <DialogButtonMaximize
        show={props.maximizable || false}
        maximized={props.maximized}
        onClick={() => props.toggleMaximize()}
      />
    </div>
  )
}

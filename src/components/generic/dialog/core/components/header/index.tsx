import { classPropToString } from '/src/components'

import { DialogButtonClose } from './components/buttonClose'
import { DialogButtonMaximize } from './components/buttonMaximize'

interface Props {
  maximized: boolean
  title?: string
  maximizable?: boolean
  moveable?: boolean
  closeable?: boolean
  close: Accessor<DialogCloseFunction | undefined>
  toggleMaximized: Accessor<DialogToggleMaximizedFunction | undefined>
  setRef: (ref: HTMLElement) => void
}

export const DialogHeader = (props: Props) => {
  return (
    <div
      ref={props.setRef}
      onDblClick={() => props.toggleMaximized()?.()}
      class={classPropToString([
        !props.maximized && props.moveable && 'md:cursor-move',
        'flex items-center px-4 pb-3 pt-4',
      ])}
    >
      <Show when={props.closeable}>
        <DialogButtonClose close={props.close?.()} />
      </Show>

      <h2 class="grow truncate text-center text-xl font-semibold">
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
        onClick={props.toggleMaximized?.()}
      />
    </div>
  )
}

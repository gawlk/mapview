import {
  dialogBooleanPropsKeysObject,
  HeadlessDialog,
  removeProps,
} from '/src/components'
import { createASS, run } from '/src/scripts'

import {
  DialogBody,
  DialogDivider,
  DialogForm,
  DialogHeader,
} from './components'

type Props = DialogPropsWithHTMLAttributes

export const DialogCore = (props: Props) => {
  const dialogProps = removeProps(props, dialogBooleanPropsKeysObject)

  const close = createASS<DialogCloseFunction | undefined>(undefined)
  const toggleMaximized = createASS<DialogToggleMaximizedFunction | undefined>(
    undefined,
  )

  const absolute = createASS(false)
  const maximized = createASS(false)
  const handle = createASS<HTMLElement | undefined>(undefined)

  return (
    <HeadlessDialog
      {...dialogProps}
      backdrop={!props.moveable && !props.resizable}
      onCloseCreated={(_close) => {
        close.set(() => _close)
      }}
      onToggleMaximizeCreated={(_toggleMax) => {
        toggleMaximized.set(() => _toggleMax)
      }}
      classes={[
        run(() => {
          switch (props.color) {
            case 'transparent':
              return 'bg-transparent'
            default:
              return `bg-white`
          }
        }),

        'border-black/5 text-black opacity-0 transition duration-150 backdrop:bg-transparent motion-reduce:transform-none motion-reduce:transition-none',
      ]}
      onAbsolute={absolute.set}
      onMaximized={maximized.set}
      handle={handle}
      classesOpen="open:translate-x-0 open:opacity-100"
      classesMoveable="md:shadow-xl md:drop-shadow-lg"
      classesAbsolute="max-h-[40vh] min-w-[12rem] space-y-1.5 rounded-xl border-2"
      classesWindowed="bottom-0 top-auto mt-[5vh] max-h-[95vh] rounded-t-2xl border-t-2 md:mt-0 md:h-fit md:max-h-[32rem] w-full max-w-full space-y-3 md:rounded-b-2xl md:border-2  md:max-w-2xl"
    >
      <div class="flex h-full max-h-full flex-1 flex-col space-y-3">
        <Show when={!absolute() && props.color !== 'transparent'}>
          <DialogHeader
            maximized={maximized()}
            setRef={handle.set}
            maximizable={props.maximizable}
            moveable={props.moveable}
            closeable={props.closeable}
            title={props.title}
            close={close}
            toggleMaximized={toggleMaximized}
          />

          <DialogDivider class="!mt-0" color={props.color} />
        </Show>

        <Show when={props.sticky}>
          {props.sticky}
          <DialogDivider color={props.color} />
        </Show>

        <DialogBody
          color={props.color}
          isAbsolute={absolute()}
          close={close}
          footer={props.footer}
          children={props.children}
          form={props.form}
        />

        <Show when={props.footer}>
          <DialogDivider class="!mt-0" color={props.color} />

          <div class="flex items-center px-4 pb-4">
            <DialogForm close={close} children={props.footer} />
          </div>
        </Show>
      </div>
    </HeadlessDialog>
  )
}

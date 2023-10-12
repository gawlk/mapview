import { Button, HeadlessDialog, Label } from '/src/components'
import { createASS } from '/src/scripts'

export const HeadlessDialogStory = () => {
  let open: DialogOpenFunction | undefined
  let close: DialogCloseFunction | undefined
  let toggleMaximized: DialogToggleMaximizedFunction | undefined

  const handle = createASS<HTMLElement | undefined>(undefined)
  const button = createASS<HTMLElement | undefined>(undefined)
  const attach = createASS<HTMLElement | undefined>(undefined)

  return (
    <Label label="Dialog">
      <Button ref={button.set} onClick={() => open?.(true)}>
        Open dialog
      </Button>
      <HeadlessDialog
        title="Resizable"
        backdrop
        resizable
        moveable
        handle={handle}
        attach={attach}
        onOpenCreated={(_open) => {
          open = _open
        }}
        onCloseCreated={(_close) => {
          close = _close
        }}
        onToggleMaximizeCreated={(_toggleMax) => {
          toggleMaximized = _toggleMax
        }}
        classes={[
          // run(() => {
          // switch (props.color) {
          //   case 'transparent':
          //     return 'bg-transparent'
          //   default:
          // return `bg-white`
          // }
          // }),
          'bg-white',

          'border-black/5 text-black opacity-0 transition duration-150 backdrop:bg-transparent motion-reduce:transform-none motion-reduce:transition-none',
        ]}
        classesOpen="open:translate-x-0 open:opacity-100"
        classesMoveable="md:shadow-xl md:drop-shadow-lg"
        classesAbsolute="max-h-[40vh] min-w-[12rem] space-y-1.5 rounded-xl border-2"
        classesWindowed="bottom-0 top-auto mt-[5vh] max-h-[95vh] rounded-t-2xl border-t-2 md:mt-0 md:h-fit md:max-h-[32rem] w-full max-w-full space-y-3 md:rounded-b-2xl md:border-2  md:max-w-2xl"
      >
        <div class="p-4">
          <p
            ref={handle.set}
            onDblClick={() => toggleMaximized?.()}
            class="cursor-move p-2 text-xl font-bold uppercase"
          >
            Resizable dialog (handle)
          </p>
          <Button
            onClick={() => {
              if (attach()) {
                attach.set(undefined)
              } else {
                attach.set(button())
              }
            }}
          >
            {!attach() ? 'Attach' : 'Detach'}
          </Button>
          <Button
            onClick={() => {
              close?.()
            }}
          >
            Close dialog
          </Button>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
            libero nunc consequat interdum varius sit amet mattis. Purus in
            massa tempor nec feugiat. Posuere urna nec tincidunt praesent
            semper. Adipiscing tristique risus nec feugiat in fermentum posuere
            urna. Ut tortor pretium viverra suspendisse potenti nullam ac
            tortor. Eu mi bibendum neque egestas congue. Ac turpis egestas
            integer eget. Augue lacus viverra vitae congue eu consequat ac
            felis. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae.
            Aliquam vestibulum morbi blandit cursus risus at. Fermentum dui
            faucibus in ornare quam viverra orci. Iaculis eu non diam phasellus
            vestibulum lorem sed risus. Malesuada fames ac turpis egestas sed.
            Sollicitudin ac orci phasellus egestas tellus rutrum. Vel pharetra
            vel turpis nunc eget lorem. Amet consectetur adipiscing elit
            pellentesque habitant morbi tristique senectus et. Aliquam ultrices
            sagittis orci a scelerisque. Sed turpis tincidunt id aliquet risus.
            Turpis egestas maecenas pharetra convallis posuere morbi leo urna.
          </p>
          <p>
            Semper eget duis at tellus at urna condimentum mattis pellentesque.
            Sagittis id consectetur purus ut faucibus. Est ante in nibh mauris
            cursus mattis. Pellentesque elit eget gravida cum sociis. Dui ut
            ornare lectus sit amet. Nunc eget lorem dolor sed viverra ipsum
            nunc. At lectus urna duis convallis. Erat pellentesque adipiscing
            commodo elit at imperdiet dui accumsan. Orci ac auctor augue mauris
            augue. Eleifend donec pretium vulputate sapien nec sagittis aliquam.
            At elementum eu facilisis sed. Vestibulum sed arcu non odio euismod
            lacinia at. Id donec ultrices tincidunt arcu non sodales neque
            sodales ut.
          </p>
        </div>
      </HeadlessDialog>
    </Label>
  )
}

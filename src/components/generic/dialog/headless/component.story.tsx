import { Button, HeadlessDialog, Label } from '/src/components'
import { createASS } from '/src/scripts'

export const HeadlessDialogStory = () => {
  let open: DialogOpenFunction | undefined
  let toggleMaximized: DialogToggleMaximizedFunction | undefined

  const handle = createASS<HTMLElement | undefined>(undefined)

  return (
    <Label label="Dialog">
      <Button onClick={() => open?.(true)}>Open dialog</Button>
      <HeadlessDialog
        backdrop
        title="Resizable"
        resizable
        handle={handle}
        moveable
        onOpenCreated={(_open) => {
          open = _open
        }}
        onToggleMaximizeCreated={(_toggle) => {
          console.log('toggle created')
          // _toggle()
          toggleMaximized = _toggle
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

          'border-black/5 text-black opacity-0 transition duration-150 backdrop:bg-transparent open:flex motion-reduce:transform-none motion-reduce:transition-none',
        ]}
        classesOpen="open:translate-x-0 open:opacity-100"
        classesMoveable="md:shadow-xl md:drop-shadow-lg"
        classesAttached="max-h-[40vh] min-w-[12rem] space-y-1.5 rounded-xl border-2"
        classesWindowed="top-auto mt-[5vh] max-h-[95vh] rounded-t-2xl border-t-2 md:mt-0 md:h-fit md:max-h-[32rem] md:max-w-2xl md:rounded-b-2xl md:border-2 w-full max-w-full space-y-3"
      >
        <div class="p-4">
          <p
            ref={handle.set}
            onDblClick={() => toggleMaximized?.()}
            class="cursor-move p-2 text-xl font-bold uppercase"
          >
            Resizable dialog (handle)
          </p>
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

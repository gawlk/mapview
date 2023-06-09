import { makeEventListener } from '@solid-primitives/event-listener'
import { useMousePosition } from '@solid-primitives/mouse'

import { resizeDialog } from './scripts'

import Resizer from './components/resizer'

interface Props {
  dialog?: HTMLDialogElement
  transform: DialogTransform
  setDimensions: (dimensions: Partial<DialogDimensions>) => void
  setTransform: (transform: Partial<DialogTransform>) => void
  setMoving: (moving: boolean) => void
}

export default (props: Props) => {
  const [state, setState] = createStore({
    resizeDirection: null as DialogResizeDirection | null,
  })

  const mousePosition = useMousePosition()

  makeEventListener(
    window,
    'mouseup',
    () => setState('resizeDirection', null),
    {
      passive: true,
    }
  )

  createEffect(
    on(
      () => state.resizeDirection,
      (resizeDirection) =>
        resizeDirection &&
        resizeDialog(
          props.dialog,
          mousePosition,
          { ...props.transform },
          resizeDirection,
          props.setDimensions,
          props.setTransform
        )
    )
  )

  createEffect(() => props.setMoving(!!state.resizeDirection))

  // TODO: Create Resizer, SideResizer and CornerResizer components
  return (
    // TODO: On double click, expand to direction instead of resetting
    // TODO: Set a snap window with default size similar to default position
    <>
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'n')}
        class={['inset-x-0 top-0 -my-1.5 hidden h-3 w-full cursor-ns-resize']}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'w')}
        class={[
          'bottom-0 left-0 top-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize',
        ]}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 's')}
        class={[
          'inset-x-0 bottom-0 -my-1.5 hidden h-3 w-full cursor-ns-resize',
        ]}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'e')}
        class={[
          'bottom-0 right-0 top-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize',
        ]}
      />

      <Resizer
        onMouseDown={() => setState('resizeDirection', 'nw')}
        class={['left-0 top-0 -m-2 hidden h-6 w-6 cursor-nwse-resize']}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'sw')}
        class={['bottom-0 left-0 -m-2 hidden h-6 w-6 cursor-nesw-resize ']}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'se')}
        class={['bottom-0 right-0 -m-2 hidden h-6 w-6 cursor-nwse-resize']}
      />
      <Resizer
        onMouseDown={() => setState('resizeDirection', 'ne')}
        class={['right-0 top-0 -m-2 hidden h-6 w-6 cursor-nesw-resize']}
      />
    </>
  )
}

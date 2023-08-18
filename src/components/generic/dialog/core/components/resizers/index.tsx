import { makeEventListener } from '@solid-primitives/event-listener'
import { useMousePosition } from '@solid-primitives/mouse'

import { classPropToString } from '/src/components/generic/props'

import { activateSelectNone, deactivateSelectNone } from '../scripts'
import { expand, resizeDialog } from './scripts'

interface Props {
  dialog?: HTMLDialogElement
  setDimensions: (dimensions: Partial<DialogDimensions>) => void
  setPosition: (position: Partial<DialogPosition>) => void
}

export const DialogResizers = (props: Props) => {
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
    },
  )

  createEffect(
    on(
      () => state.resizeDirection,
      (resizeDirection) => {
        if (resizeDirection) {
          activateSelectNone()

          resizeDialog(
            props.dialog,
            mousePosition,
            resizeDirection,
            props.setDimensions,
            props.setPosition,
          )
        } else {
          deactivateSelectNone()
        }
      },
    ),
  )

  const runExpand = (resizeDirection: DialogResizeDirection) =>
    expand(
      props.dialog,
      resizeDirection,
      props.setDimensions,
      props.setPosition,
    )

  const Resizer = (resizerProps: {
    direction: DialogResizeDirection
    class: ClassProp
  }) => (
    <div
      onMouseDown={() => setState('resizeDirection', resizerProps.direction)}
      onDblClick={() => runExpand(resizerProps.direction)}
      class={classPropToString(['absolute md:block', resizerProps.class])}
    />
  )

  return (
    <>
      <Resizer
        direction="n"
        class={['inset-x-0 top-0 -my-1.5 hidden h-3 w-full cursor-ns-resize']}
      />
      <Resizer
        direction="w"
        class={['inset-y-0 left-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize']}
      />
      <Resizer
        direction="s"
        class={[
          'inset-x-0 bottom-0 -my-1.5 hidden h-3 w-full cursor-ns-resize',
        ]}
      />
      <Resizer
        direction="e"
        class={['inset-y-0 right-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize']}
      />
      <Resizer
        direction="nw"
        class={['left-0 top-0 -m-2 hidden h-6 w-6 cursor-nwse-resize']}
      />
      <Resizer
        direction="sw"
        class={['bottom-0 left-0 -m-2 hidden h-6 w-6 cursor-nesw-resize ']}
      />
      <Resizer
        direction="se"
        class={['bottom-0 right-0 -m-2 hidden h-6 w-6 cursor-nwse-resize']}
      />
      <Resizer
        direction="ne"
        class={['right-0 top-0 -m-2 hidden h-6 w-6 cursor-nesw-resize']}
      />
    </>
  )
}
